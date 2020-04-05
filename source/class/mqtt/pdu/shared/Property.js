/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.shared.Property",
{
  type : "static",

  statics :
  {
    /**
     * Format this object's value into the provided pdu buffer
     *
     * @param {Map} data
     *
     *   A map containing the message type, id and property value, with keys
     *   `messageType`, `id` and `value`.
     *
     *   The message type is one of the following:
     *   - "CONNECT"
     *   - "DISCONNECT"
     *   - "Will Properties"
     *   - "PUBLISH"
     *   - "SUBSCRIBE"
     *   - "UNSUBSCRIBE"
     *   - "AUTH"
     *   - "CONNACK"
     *   - "PUBACK"
     *   - "PUBREC"
     *   - "PUBREL"
     *   - "PUBCOMP"
     *   - "SUBACK"
     *   - "UNSUBACK"
     *
     *   The id is formatted and added to
     *   the PDU. The id must be one of the constant members of
     *   mqtt.pdu.Property defined below, e.g., PayloadFormatIndicator.  The
     *   value is then formatted and added to the PDU.
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
    format : function(data, pdu, version = 0x05)
    {
      let             len;
      let             allowed;
      let             { messageType, id, value } = data;
      const           Property = mqtt.pdu.shared.Property;

      // MQTT 2.2.2.2
      switch(id)
      {
      case Property.PayloadFormatIndicator :
        // validate message type per MQTT Table 2-4
        allowed = [ "PUBLISH", "Will Properties" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `PayloadFormatIndicator is not valid in ${messageType}`);

        // byte
        qx.core.Assert.assertInteger(
          value,
          "PayloadFormatIndicator value must be a number");
        qx.core.Assert.assertInRange(
          value, 0x00, 0xff,
          "PayloadFormatIndicator value must be in [ 0x00, 0xff ]");
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;
        
      case Property.MessageExpiryInterval :
        // validate message type per MQTT Table 2-4
        allowed = [ "PUBLISH", "Will Properties" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `MessageExpiryInterval is not valid in ${messageType}`);

        // four-byte integer
        qx.core.Assert.assertInteger(
          value,
          "MessageExpiryInterval value must be a number");
        len = mqtt.pdu.primitive.Uint32.format(value, pdu, version);
        break;
        
      case Property.ContentType :
        // validate message type per MQTT Table 2-4
        allowed = [ "PUBLISH", "Will Properties" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `ContentType is not valid in ${messageType}`);

        // utf-8 string
        qx.core.Assert.assertString(
          value,
          "ContentType value must be a string");
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ResponseTopic :
        // validate message type per MQTT Table 2-4
        allowed = [ "PUBLISH", "Will Properties" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `ResponseTopic is not valid in ${messageType}`);

        // utf-8 string
        qx.core.Assert.assertString(
          value,
          "ResponseTopic value must be a string");
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.CorrelationData :
        // validate message type per MQTT Table 2-4
        allowed = [ "PUBLISH", "Will Properties" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `CorrelationData is not valid in ${messageType}`);

        // binary data
        len = mqtt.pdu.primitive.Binary.format(value, pdu, version);
        break;
        
      case Property.SubscriptionIdentifier :
        // validate message type per MQTT Table 2-4
        allowed = [ "PUBLISH", "SUBSCRIBE" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `SubscriptionIdentifier is not valid in ${messageType}`);

        // variable byte integer
        len = mqtt.pdu.primitive.UintVar.format(value, pdu, version);
        break;
        
      case Property.SessionExpiryInterval :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNECT", "CONNACK", "DISCONNECT" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `SessionExpiryInterval is not valid in ${messageType}`);

        // four-byte integer
        qx.core.Assert.assertInteger(
          value,
          "SessionExpiryInterval value must be a number");
        len = mqtt.pdu.primitive.Uint32.format(value, pdu, version);
        break;
        
      case Property.AssignedClientIdentifier :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `AssignedClientIdentifier is not valid in ${messageType}`);

        // utf-8 string
        qx.core.Assert.assertString(
          value,
          "AssignedClientIdentifier value must be a string");
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ServerKeepAlive :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `ServerKeepAlive is not valid in ${messageType}`);

        // two-byte integer
        qx.core.Assert.assertInteger(
          value,
          "ServerKeepAlive value must be a number");
        qx.core.Assert.assertInRange(
          value, 0, 65535,
          "ServerKeepAlive value must be in [ 0, 65535 ]");
        len = mqtt.pdu.primitive.Uint16.format(value, pdu, version);
        break;
        
      case Property.AuthenticationMethod :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNECT", "CONNACK", "AUTH" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `AuthenticationMethod is not valid in ${messageType}`);

        // utf-8 string
        qx.core.Assert.assertString(
          value,
          "AuthenticationMethod value must be a string");
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.AuthenticationData :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNECT", "CONNACK", "AUTH" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `AuthenticationData is not valid in ${messageType}`);

        // binary data
        len = mqtt.pdu.primitive.Binary.format(value, pdu, version);
        break;

      case Property.RequestProblemInformation :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNECT" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `RequestProblemInformation is not valid in ${messageType}`);

        // byte
        qx.core.Assert.assertInteger(
          value,
          "RequestProblemInformation value must be a number");
        qx.core.Assert.assertInRange(
          value, 0x00, 0xff,
          "RequestProblemInformation value must be in [ 0x00, 0xff ]");
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;
        
      case Property.WillDelayInterval :
        // validate message type per MQTT Table 2-4
        allowed = [ "Will Properties" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `WillDelayInterval is not valid in ${messageType}`);

        // four-byte integer
        qx.core.Assert.assertInteger(
          value,
          "WillDelayInterval value must be a number");
        len = mqtt.pdu.primitive.Uint32.format(value, pdu, version);
        break;
        
      case Property.RequestResponseInformation :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNECT" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `RequestResponseInformation is not valid in ${messageType}`);

        // byte
        qx.core.Assert.assertInteger(
          value,
          "RequestResponseInformation value must be a number");
        qx.core.Assert.assertInRange(
          value, 0x00, 0xff,
          "RequestResponseInformation value must be in [ 0x00, 0xff ]");
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;
        
      case Property.ResponseInformation :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `ResponseInformation is not valid in ${messageType}`);

        // utf-8 string
        qx.core.Assert.assertString(
          value,
          "ResponseInformation value must be a string");
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ServerReference :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNACK", "DISCONNECT" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `ServerReference is not valid in ${messageType}`);

        // utf-8 string
        qx.core.Assert.assertString(
          value,
          "ServerReference value must be a string");
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ReasonString :
        // validate message type per MQTT Table 2-4
        allowed =
          [
            "CONNACK",
            "PUBACK",
            "PUBREC",
            "PUBREL",
            "PUBCOMP",
            "SUBACK",
            "UNSUBACK",
            "DISCONNECT",
            "AUTH"
          ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `ReasonString is not valid in ${messageType}`);

        // utf-8 string
        qx.core.Assert.assertString(
          value,
          "ReasonString value must be a string");
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ReceiveMaximum :
        // validate message type per MQTT Table 2-4
        allowed = [ "Connect", "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `ReceiveMaximum is not valid in ${messageType}`);

        // two-byte integer
        qx.core.Assert.assertInteger(
          value,
          "ReceiveMaximum value must be a number");
        qx.core.Assert.assertInRange(
          value, 0, 65535,
          "ReceiveMaximum value must be in [ 0, 65535 ]");
        len = mqtt.pdu.primitive.Uint16.format(value, pdu, version);
        break;
        
      case Property.TopicAliasMaximum :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNECT", "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `TopicAliasMaximum is not valid in ${messageType}`);

        // two-byte integer
        qx.core.Assert.assertInteger(
          value,
          "TopicAliasMaximum value must be a number");
        qx.core.Assert.assertInRange(
          value, 0, 65535,
          "TopicAliasMaximum value must be in [ 0, 65535 ]");
        len = mqtt.pdu.primitive.Uint16.format(value, pdu, version);
        break;
        
      case Property.TopicAlias :
        // validate message type per MQTT Table 2-4
        allowed = [ "PUBLISH" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `TopicAlias is not valid in ${messageType}`);

        // two-byte integer
        qx.core.Assert.assertInteger(
          value,
          "TopicAlias value must be a number");
        qx.core.Assert.assertInRange(
          value, 0, 65535,
          "TopicAlias value must be in [ 0, 65535 ]");
        len = mqtt.pdu.primitive.Uint16.format(value, pdu, version);
        break;
        
      case Property.MaximumQoS :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `MaximumQoS is not valid in ${messageType}`);

        // byte
        qx.core.Assert.assertInteger(
          value,
          "MaximumQoS value must be a number");
        qx.core.Assert.assertInRange(
          value, 0x00, 0x2,
          "MaximumQoS value must be in [ 0, 2 ]");
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;
        
      case Property.RetainAvailable :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `RetainAvailable is not valid in ${messageType}`);

        // byte
        qx.core.Assert.assertBoolean(
          value,
          "RetainAvailable value must be a boolean");
        len = mqtt.pdu.primitive.Byte.format(value ? 1 : 0, pdu, version);
        break;

      case Property.UserProperty:
        // validate message type per MQTT Table 2-4
        allowed =
          [
            "CONNECT",
            "CONNACK",
            "PUBLISH",
            "Will Properties",
            "PUBACK",
            "PUBREC",
            "PUBREL",
            "PUBCOMP",
            "SUBSCRIBE",
            "SUBACK",
            "UNSUBSCRIBE",
            "UNSUBACK",
            "DISCONNECT",
            "AUTH"
          ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `UserProperty is not valid in ${messageType}`);

        // utf-8 string pair
        qx.core.Assert.assertArray(
          value,
          "UserProperty value must ben an array");
        qx.core.Assert.assert(
          value.length == 2,
          "UserProperty value must ben an array of 2 elements (type, value");
        qx.core.Assert.assertString(
          value[0],
          "UserProperty value[0] (type)  must be a string");
        qx.core.Assert.assertString(
          value[1],
          "UserProperty value[1] (value) must be a string");
        len = mqtt.pdu.primitive.String.format(value[1], pdu, version);
        len += mqtt.pdu.primitive.String.format(value[0], pdu, version);
        break;

      case Property.MaximumPacketSize :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNECT", "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `MaximumPacketSize is not valid in ${messageType}`);

        // four-byte integer
        qx.core.Assert.assertInteger(
          value,
          "MaximumPacketSize value must be a number");
        len = mqtt.pdu.primitive.Uint32.format(value, pdu, version);
        break;

      case Property.WildcardSubscriptionAvailable :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `WildcardSubscriptionAvailable is not valid in ${messageType}`);

        // byte
        qx.core.Assert.assertBoolean(
          value,
          "WildcardSubscriptionAvailable value must be a boolean");
        len = mqtt.pdu.primitive.Byte.format(value ? 1 : 0, pdu, version);
        break;

      case Property.SubscriptionIdentifiersAvailable :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `SubscriptionIdentifiersAvailable is not valid in ${messageType}`);

        // byte
        qx.core.Assert.assertBoolean(
          value,
          "SubscriptionIdentifiersAvailable value must be a boolean");
        len = mqtt.pdu.primitive.Byte.format(value ? 1 : 0, pdu, version);
        break;

      case Property.SharedSubscriptionAvailable :
        // validate message type per MQTT Table 2-4
        allowed = [ "CONNACK" ];
        qx.core.Assert.assert(
          allowed.includes(messageType),
          `SharedSubscriptionAvailable is not valid in ${messageType}`);

        // byte
        qx.core.Assert.assertBoolean(
          value,
          "SharedSubscriptionAvailable value must be a boolean");
        len = mqtt.pdu.primitive.Byte.format(value ? 1 : 0, pdu, version);
        break;

      default :
        throw new Error(`Unknown property id: ${id}`);
      }

      // Now we can add the id itself
      len += mqtt.pdu.primitive.UintVar.format(id, pdu, version);

      return len;
    },
    
    /**
     * Parse an object of this type, beginning at the given pdu position
     *
     * @param {Uint8Array} pdu
     *   The buffer from which we are parsing
     *
     * @param {Number} version
     *   MQTT protocol version to comply with to format/parse
     */
    parse : function(pdu, version = 0x05)
    {
      let             id;
      let             value;
      const           Property = mqtt.pdu.shared.Property;

      // Retrieve the id
      id = mqtt.pdu.primitive.UintVar.parse(pdu, version);

      switch(id)
      {
      case Property.PayloadFormatIndicator :
        // byte
        value = mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;
        
      case Property.MessageExpiryInterval :
        // four-byte integer
        value = mqtt.pdu.primitive.Uint32.parse(pdu, version);
        break;
        
      case Property.ContentType :
        // utf-8 string
        value = mqtt.pdu.primitive.String.parse(pdu, version);
        break;
        
      case Property.ResponseTopic :
        // utf-8 string
        value = mqtt.pdu.primitive.String.parse(pdu, version);
        break;
        
      case Property.CorrelationData :
        // binary data
        value = mqtt.pdu.primitive.Binary.parse(pdu, version);
        break;
        
      case Property.SubscriptionIdentifier :
        // variable byte integer
        value = mqtt.pdu.primitive.UintVar.parse(pdu, version);
        break;
        
      case Property.SessionExpiryInterval :
        // four-byte integer
        value = mqtt.pdu.primitive.Uint32.parse(pdu, version);
        break;
        
      case Property.AssignedClientIdentifier :
        // utf-8 string
        value = mqtt.pdu.primitive.String.parse(pdu, version);
        break;
        
      case Property.ServerKeepAlive :
        // two-byte integer
        value = mqtt.pdu.primitive.Uint16.parse(pdu, version);
        break;
        
      case Property.AuthenticationMethod :
        // utf-8 string
        value = mqtt.pdu.primitive.String.parse(pdu, version);
        break;
        
      case Property.AuthenticationData :
        // binary data
        value = mqtt.pdu.primitive.Binary.parse(pdu, version);
        break;

      case Property.RequestProblemInformation :
        // byte
        value = mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;
        
      case Property.WillDelayInterval :
        // four-byte integer
        value = mqtt.pdu.primitive.Uint32.parse(pdu, version);
        break;
        
      case Property.RequestResponseInformation :
        // byte
        value = mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;
        
      case Property.ResponseInformation :
        // utf-8 string
        value = mqtt.pdu.primitive.String.parse(pdu, version);
        break;
        
      case Property.ServerReference :
        // utf-8 string
        value = mqtt.pdu.primitive.String.parse(pdu, version);
        break;
        
      case Property.ReasonString :
        // utf-8 string
        value = mqtt.pdu.primitive.String.parse(pdu, version);
        break;
        
      case Property.ReceiveMaximum :
        // two-byte integer
        value = mqtt.pdu.primitive.Uint16.parse(pdu, version);
        break;
        
      case Property.TopicAliasMaximum :
        // two-byte integer
        value = mqtt.pdu.primitive.Uint16.parse(pdu, version);
        break;
        
      case Property.TopicAlias :
        // two-byte integer
        value = mqtt.pdu.primitive.Uint16.parse(pdu, version);
        break;
        
      case Property.MaximumQoS :
        // byte
        value = mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;
        
      case Property.RetainAvailable :
        // byte
        value = !! mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;

      case Property.UserProperty:
        // utf-8 string pair
        value = [];
        value.push(mqtt.pdu.primitive.String.parse(pdu, version));
        value.push(mqtt.pdu.primitive.String.parse(pdu, version));
        break;

      case Property.MaximumPacketSize :
        // four-byte integer
        value = mqtt.pdu.primitive.Uint32.parse(pdu, version);
        break;

      case Property.WildcardSubscriptionAvailable :
        // byte
        value = !! mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;

      case Property.SubscriptionIdentifiersAvailable :
        // byte
        value = !! mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;

      case Property.SharedSubscriptionAvailable :
        // byte
        value = !! mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;

      default :
        throw new Error(`Protocol violation: unknown property id (${id})`);
      }

      return { id : id, value : value};
    },

    //
    // Property Identifiers
    //

    /** byte; PUBLISH, Will properties */
    PayloadFormatIndicator          : 0x01,

    /** four-byte integer; PUBLISH, Will properties */
    MessageExpiryInterval           : 0x02,

    /** utf-8 string; PUBLISH, Will properties */
    ContentType                     : 0x03,

    /** utf-8 string; PUBLISH, Will properties */
    ResponseTopic                   : 0x08,

    /** binary data; PUBLISH, Will properties */
    CorrelationData                 : 0x09,

    /** variable byte integer; PUBLISH, SUBSCRIBE */
    SubscriptionIdentifier          : 0x0b,

    /** four-byte integer; CONNECT, CONNACK, DISCONNECT */
    SessionExpiryInterval           : 0x11,

    /** utf-8 string; CONNACK */
    AssignedClientIdentifier        : 0x12,

    /** two-byte integer; CONNACK */
    ServerKeepAlive                 : 0x13,

    /** utf-8 string; CONNECT, CONNACK, AUTH */
    AuthenticationMethod            : 0x15,

    /** binary data; CONNECT, CONNACK, AUTH */
    AuthenticationData              : 0x16,

    /** byte; CONNECT */
    RequestProblemInformation       : 0x17,

    /** four-byte integer; Will properties */
    WillDelayInterval               : 0x18,

    /** byte; CONNECT */
    RequestResponseInformation      : 0x19,

    /** utf-8 string; CONNACK */
    ResponseInformation             : 0x1a,

    /** utf-8 string; CONNACK, DISCONNECT */
    ServerReference                 : 0x1c,

    /**
     * utf-8 string;
     * CONNACK, PUBACK, PUBREC, PUBREL, PUBCOMP,
     * SUBACK, UNSUBACK, DISCONNECT, AUTH
     */
    ReasonString                    : 0x1f,

    /** two-byte integer; CONNECT, CONNACK */
    ReceiveMaximum                  : 0x21,

    /** two-byte integer; CONNECT, CONNACK */
    TopicAliasMaximum               : 0x22,

    /** two-byte integer; PUBLISH */
    TopicAlias                      : 0x23,

    /** byte; CONNACK */
    MaximumQoS                      : 0x24,

    /** byte; CONNACK */
    RetainAvailable                 : 0x25,

    /**
     * utf-8 string pair
     * CONNECT, CONNACK, PUBLISH, Will properties,
     * PUBACK, PUBREC, PUBREL, PUBCOMP,
     * SUBSCRIBE, SUBACK, UNSUBSCRIBE, UNSUBACK,
     * DISCONNEC, AUTH
     */
    UserProperty                    : 0x26,

    /** four-byte integer; CONNECT, CONNACK */
    MaximumPacketSize               : 0x27,

    /** byte; CONNACK */
    WildcardSubscriptionAvailable   : 0x28,

    /** byte; CONNACK */
    SubscriptionIdentifiersAvailable : 0x29,

    /** byte; CONNACK */
      SharedSubscriptionAvailable     : 0x2a
  }
});
