/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.control.Connect",
{
  type : "static",

  statics :
  {
    Flags :
    {
      Username   : 1 << 7,
      Password   : 1 << 6,
      WillRetain : 1 << 5,
      WillQoS    : [ 0 << 3, 1 << 3, 2 << 3 ],
      Will       : 1 << 2,
      CleanStart : 1 << 1
    },

    /**
     * Format this object's value into the provided pdu buffer
     *
     * @param {Map} connectInfo
     *   A map containing the members to be encoded in the pdu, including:
     *     - cleanStart {Boolean?}
     *     - clientId {String?}
     *       - If omitted or an empty string, one is auto-generated
     *     - username {String?}
     *     - password {String?}
     *     - keepAliveSeconds {Integer?0}
     *
     *     All or none of the following will members must be present:
     *     - willQoS {0|1|2?}
     *     - willTopic {String?}
     *     - willPayload {String|Uint8Array?}
     *       - if String, payloadFormatIndicator will be auto-set to 1 (string)
     *       - if Uint8Array, payloadFormatIndicator will be set to 0 (bytes)
     *
     *     These will members may be present if the above will members are
     *     present:
     *     - willRetain {Boolean?},
     *     - willMessageExpiryInterval {Integer?}
     *     - willContentType {String?}
     *     - willResponseTopic {String?}
     *     - willDelayInterval {Integer?}
     *
     *   - willProperties
     *     Map of properties. Key and value type are shown. All are optional
     *     - payloadFormatIndicator {Byte}
     *     - messageExpiryInterval {Uint32}
     *     - contentType {String}
     *     - responseTopic {String}
     *     - correlationData {Uint8Array}
     *     - willDelayInterval {Uint32}
     *     - userProperties {StringPairArray[]}  (array of 2-element arrays)
     *
     *   - connectProperties
     *     Map of properties. Key and value type are shown. All are optional
     *     - sessionExpiryInterval {Uint32}
     *     - authenticationMethod {String}
     *     - authenticationData {String}
     *     - requestProblemInformation {Byte}
     *     - requestResponseInformation {Byte}
     *     - receiveMaximum {Uint16}
     *     - topicAliasMaximum {Uint16}
     *     - userProperties {StringPairArray[]}  (array of 2-element arrays)
     *     - maximumPacketSize {Uint32}
     *
     * @param {mqtt.Buffer} pdu
     *   PDU to which the value should be prepended
     *
     * @param {Number?0x05} version
     *   MQTT protocol version to comply with to format/parse
     *
     * @return {Number}
     *   Number of octets prepended to the PDU
     */
    format : function(connectInfo, pdu, version = 0x05)
    {
      let             ops;
      let             len = 0;
      let             willPropertyLen = 0;
      let             connectPropertyLen = 0;
      let             payloadFormatIndicator;
      let             connectFlags = 0x00;
      let             willFieldsFound = 0x00;
      const           Connect = mqtt.pdu.control.Connect;
      const           Property = mqtt.pdu.shared.Property;
      

      //
      // Validate arguments
      //

      // Ensure the version is recognized.
      qx.core.Assert.assertIdentical(
        0x05, version,
        "version must be 5");

      // Validate the string arguments
      [
        "username",
        "password",
        "willTopic",
        "responseTopic",
        "contentType"
      ].forEach((name) =>
        {
          if (name in connectInfo)
          {
            qx.core.Assert.assertString(
              connectInfo[name],
              `${name} must be a string`);
          }
        });

      qx.core.Assert.assertMap(
        connectInfo,
        "connectInfo argument must be a map");

      if ("willRetain" in connectInfo)
      {
        qx.core.Assert.assertBoolean(
          connectInfo.willRetain,
          "willRetain must be a boolean");
      }
      if ("willQoS" in connectInfo)
      {
        qx.core.Assert.assert(
          [ 0, 1, 2 ].includes(connectInfo.willQoS),
          "willQoS must be 0, 1, or 2");
      }

      if ("willPayload" in connectInfo)
      {
        qx.core.Assert.assert(
          typeof connectInfo.willPayload == "string" ||
            connectInfo.willPayload instanceof Uint8Array,
          "willPayload must be string or Uint8Array");
      }

      if ("willProperties" in connectInfo)
      {
        qx.core.Assert.assertArray(
          connectInfo.willProperties,
          "willProperties must be an array of maps");
        connectInfo.willProperties.forEach(
          (property) =>
            {
              qx.core.Assert.assertMap(
                property,
                "Each member of willProperties must be a map");
              qx.core.Assert.assert(
                "id" in property && "value" in property,
                "Each member of willProperties must contain " +
                  "'id' and 'value' members");
              qx.core.Assert.assertString(
                property.id,
                "The id of a willProperties member must be a string");
            });
      }

      // Either all of willRetain, willQoS, willProperties, willTopic, and
      // willPayload must be present, or none of them
      qx.core.Assert.assert(
        ("willQoS" in connectInfo &&
         "willProperties" in connectInfo &&
         "willTopic" in connectInfo &&
         "willPayload" in connectInfo)
        ||
        (! ("willQoS" in connectInfo) &&
         ! ("willProperties" in connectInfo) &&
         ! ("willTopic" in connectInfo) &&
         ! ("willPayload" in connectInfo)));

      qx.core.Assert.assertInstance(pdu, mqtt.Buffer);


      //
      // Format this request. The functions in this array are executed in
      // ***reverse*** order, as we prepend each formatted object to the PDU.
      //
      ops =
      [
        //
        // 3.1.1 CONNECT Fixed Header
        //

        // 3.1.1
        // Prepend the control packet type
        () =>
          {
            mqtt.pdu.primitive.Byte(
              mqtt.pdu.shared.ControlType.CONNECT | 0x0, pdu, version);
          },

        // 3.1.1
        // Prepend the remaining length
        () =>
          {
            mqtt.pdu.primitive.UintVar(len, pdu, version);
          },

        //
        // 3.1.2 CONNECT Variable Header
        //

        // 3.1.2.1 Protocol Name.
        // This is constant, len 0x0004, value "MQTT"
        () =>
          {
            [ 0, 4, 'M', 'Q', 'T', 'T' ]
              .reverse()
              .forEach(
                (byte) =>
                  {
                    len += mqtt.pdu.primitive.Byte(byte, pdu, version);
                  });
          },

        // 3.1.2.2 Protocol Version
        () =>
          {
            len += mqtt.pdu.primitive.Byte(version, pdu, version);
          },

        // 3.1.2.3 Connect Flags
        () =>
          {
            // 3.1.2.4 Clean Start
            if (connectInfo.cleanStart)
            {
              connectFlags |= Connect.Flags.CleanStart;
            }

            // 3.1.2.5 Will Flag
            // We previously confirmed that all or none of willQoS,
            // willProperties, willTopic, willPayload are present. If one
            // of them, then, is present, we'll set Will Flag to 1.
            if ("willQoS" in connectInfo)
            {
              // 3.1.2.5 Will Flag
              connectFlags |= Connect.Flags.Will;

              // 3.1.2.6 Will QoS
              connectFlags |= Connect.Flags.WillQoS[connectInfo.willQoS];

              // 3.1.2.7 Will Retain
              connectFlags |= Connect.Flags.WillRetain ? 1 : 0;
            }

            // 3.1.2.8 User Name Flag
            if (connectInfo.username)
            {
              connectFlags |= Connect.Flags.Username;
            }

            // 3.1.2.9 Password Flag
            if (connectInfo.password)
            {
              connectFlags |= Connect.Flags.Password;
            }

            // Add the Connect Flags
            len += mqtt.pdu.primitive.Byte(connectFlags, pdu, version);
          },

        // 3.1.2.10 Keep Alive
        () =>
          {
             len +=
               mqtt.pdu.primitive.Uint16.format(
                    connectInfo.keepAliveSeconds || 0, pdu, version);
          },

        //
        // CONNECT Properties
        //

        // 3.1.2.11.1 Property Length
        () =>
          {
            len +=
              mqtt.pdu.primitive.UIntVar.format(
                connectPropertyLen, pdu, version);            
          },

        // 3.1.2.11.[2-10] Properties
        () =>
          {
            for (let [ property, value ] of connectInfo.connectProperties)
            {
              connectPropertyLen += mqtt.pdu.shared.Property.format(
                {
                  messageType : "CONNECT",
                  id          : property,
                  value       : value
                },
                pdu,
                version);
            }

            len += connectPropertyLen;
          },


        //
        // 3.1.3 CONNECT Payload
        //

        // 3.1.3.1 Client Identifier
        () =>
          {
            // If a client id is empty or not provided, then auto-generate one
            if (! connectInfo.clientId)
            {
              connectInfo.clientId = this._generateClientId();
            }

            len +=
              mqtt.pdu.primitive.String.format(
                connectInfo.clientId, pdu, version);
          },

        
        // 3.1.3.2 Will Properties length
        () =>
          { 
            if (connectInfo.willProperties)
            {
             len +=
                willPropertyLen +
                  mqtt.pdu.primitive.UIntVar.format(
                    willPropertyLen, pdu, version);
            }
          },

        // 3.1.3.2 Will Properties
        () =>
          {
            if (connectInfo.willProperties)
            {
              // Prepend each will property
              connectInfo.willProperties.forEach(
                (property) =>
                  {
                    let { id, value } = property;

                    // Don't allow them to provide a Payload Format Indicator
                    // property. We derive that one ourselves.
                    if (id == Property.PayloadFormatIndicator)
                    {
                      throw new Error(
                        "The Payload Format Indicator property is determined ",
                        "from the type of the will payload: whether the will ",
                        "payload is a string or a Uint8Array. Do not provide ",
                        "this property yourself.");
                    }

                    willPropertyLen +=
                      mqtt.pdu.shared.Property.format(
                        {
                          messageType : "Will properties",
                          id          : id,
                          value       : value
                        },
                        pdu,
                        version);
                  });

            }
          },

        // Prepend the will topic
        () =>
          {
            if (connectInfo.willTopic)
            {
              len +=
                mqtt.pdu.primitive.String.format(
                  connectInfo.willTopic, pdu, version);
            }
          },

        // Prepend tghe will payload
        () =>
          {
            if (connectInfo.willPayload)
            {
                // Prepare a payload format indicator. Assume binary will
                // payload
                payloadFormatIndicator =
                  {
                    id    : Property.PayloadFormatIndicator,
                    value : 0
                  };

                // If the will payload is a string, ...
                if (typeof connectInfo.willPayload == "string")
                {
                  // ... then indicate such in the payload format indicator
                  payloadFormatIndicator.value = 1;

                  // Format it as a utf-8 string
                  len +=
                    mqtt.pdu.primitive.String.format(
                      connectInfo.willPayload, pdu, version);
                }
                else
                {
                  // Otherwise, just send it as binary data, leaving the payload
                  // format indicator at its default
                  len +=
                    mqtt.pdu.primitive.Binary.format(
                      connectInfo.willPayload, pdu, version);
                }

              // We've already ascertained that all required will fields are
              // present, so if this one is present, we can set the flag.
              connectFlags |= Connect.Flags.Will;
            }
          },

        // Prepend the username if it exists
        () =>
          {
            if (connectInfo.username)
            {
              len +=
                mqtt.pdu.primitive.String.format(
                  connectInfo.username, pdu, version);
            }
          },

        // Prepend the password if it exists
        () =>
          {
            if (connectInfo.password)
            {
              len +=
                mqtt.pdu.primitive.String.format(
                  connectInfo.password, pdu, version);
            }
          }
      ];

      // Iterate through the operations functions in reverse order so that we
      // prepend beginning with the last item.
      ops.reverse().forEach(f => f());

      // Return the length we've prepended
      return 1;
    },
    
    /**
     * Parse an object of this type, beginning at the given pdu position
     *
     * @param {Uint8Array} pdu
     *   The buffer from which we are parsing
     * @param {Number} version
     *   MQTT protocol version to comply with to format/parse
     */
    parse : function(pdu, version = 0x05)
    {
      // Catch buffer overruns
      if (pdu.next + 1 > pdu.length)
      {
        throw new Error("Protocol violation: insufficient data");
      }

      return (pdu[pdu.next++]);
    }
  }
});
