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
     * @param {Map} idAndValue
     *   A map containing the id and property value, with keys `id` and
     *   `value`.  The id is formatted and added to the PDU. The id must be
     *   one of the constant members of mqtt.pdu.Property defined below, e.g.,
     *   PayloadFormatIndicator.  The value is then formatted and added to the
     *   PDU.
     *
     * @param {mqtt.Buffer} pdu
     *   PDU to which the value should be prepended
     *
     * @param {Number?5.0} version
     *   MQTT protocol version to comply with to format/parse
     *
     * @return {Number}
     *   Number of octets prepended to the PDU
     */
    format : function(idAndValue, pdu, version = 5.0)
    {
      let             len;
      let             { id, value } = idAndValue;
      const           Property = mqtt.pdu.shared.Property;

      // MQTT 2.2.2.2
      switch(id)
      {
      case Property.PayloadFormatIndicator :
        // byte
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;
        
      case Property.MessageExpiryInterval :
        // four-byte integer
        len = mqtt.pdu.primitive.Uint32.format(value, pdu, version);
        break;
        
      case Property.ContentType :
        // utf-8 string
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ResponseTopic :
        // utf-8 string
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.CorrelationData :
        // binary data
        len = mqtt.pdu.primitive.Binary.format(value, pdu, version);
        break;
        
      case Property.SubscriptionIdentifier :
        // variable byte integer
        len = mqtt.pdu.primitive.UintVar.format(value, pdu, version);
        break;
        
      case Property.SessionExpiryInterval :
        // four-byte integer
        len = mqtt.pdu.primitive.Uint32.format(value, pdu, version);
        break;
        
      case Property.AssignedClientIdentifier :
        // utf-8 string
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ServerKeepAlive :
        // two-byte integer
        len = mqtt.pdu.primitive.Uint16.format(value, pdu, version);
        break;
        
      case Property.AuthenticationMethod :
        // utf-8 string
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.RequestProblemInformation :
        // byte
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;
        
      case Property.WillDelayInterval :
        // four-byte integer
        len = mqtt.pdu.primitive.Uint32.format(value, pdu, version);
        break;
        
      case Property.RequestResponseInformation :
        // byte
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;
        
      case Property.ResponseInformation :
        // utf-8 string
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ServerReference :
        // utf-8 string
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ReasonString :
        // utf-8 string
        len = mqtt.pdu.primitive.String.format(value, pdu, version);
        break;
        
      case Property.ReceiveMaximum :
        // two-byte integer
        len = mqtt.pdu.primitive.Uint16.format(value, pdu, version);
        break;
        
      case Property.TopicAliasMaximum :
        // two-byte integer
        len = mqtt.pdu.primitive.Uint16.format(value, pdu, version);
        break;
        
      case Property.TopicAlias :
        // two-byte integer
        len = mqtt.pdu.primitive.Uint16.format(value, pdu, version);
        break;
        
      case Property.MaximumQoS :
        // byte
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;
        
      case Property.RetainAvailable :
        // byte
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;

      case Property.UserProperty:
        // utf-8 string pair
        len = mqtt.pdu.primitive.String.format(value[1], pdu, version);
        len += mqtt.pdu.primitive.String.format(value[0], pdu, version);
        break;

      case Property.MaximumPacketSize :
        // four-byte integer
        len = mqtt.pdu.primitive.Uint32.format(value, pdu, version);
        break;

      case Property.WildcardSubscriptionAvailable :
        // byte
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;

      case Property.SubscriptionIdentifierAvailable :
        // byte
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;

      case Property.SharedSubscriptionAvailable :
        // byte
        len = mqtt.pdu.primitive.Byte.format(value, pdu, version);
        break;

      default :
        throw new Error("Unknown property id");
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
    parse : function(pdu, version = 5.0)
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
        value = mqtt.pdu.primitive.Byte.parse(pdu, version);
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
        value = mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;

      case Property.SubscriptionIdentifierAvailable :
        // byte
        value = mqtt.pdu.primitive.Byte.parse(pdu, version);
        break;

      case Property.SharedSubscriptionAvailable :
        // byte
        value = mqtt.pdu.primitive.Byte.parse(pdu, version);
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
    SubscriptionIdentifierAvailable : 0x29,

    /** byte; CONNACK */
      SharedSubscriptionAvailable     : 0x2a
  }
});
