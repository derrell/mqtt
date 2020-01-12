/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.Uint32",
{
  extend : qx.core.Object,

  construct : function(value)
  {
    this.base(arguments);

    // Save the provided value
    this.setValue(value);
  },

  properties :
  {
    /** The current value of this 4-byte integer */
    value :
    {
      init : 0
    }
  },

  statics :
  {
    /**
     * Instantiate a new one of these objects and set its value
     *
     * @param {Number} value
     *   This integer's value
     */
    create : function(value)
    {
      return new this.constructor(value);
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
      // Catch buffer overruns
      if (pdu.next + 4 > pdu.length)
      {
        throw new Error("Protocol violation: insufficient data");
      }

      return (
        pdu[pdu.next++] << 24 |
        pdu[pdu.next++] << 16 |
        pdu[pdu.next++] << 8 |
        pdu[pdu.next++] << 0);
    }    
  },

  members :
  {
    /**
     * Prepend this object's value to the provided pdu buffer
     *
     * @param {mqtt.Buffer} pdu
     *   PDU to which the value should be prepended
     *
     * @param {Number} version
     *   MQTT protocol version to comply with to format/parse
     *
     * @return {Number}
     *   Number of octets prepended to the PDU
     */
    format : function(pdu, version = 5.0)
    {
      let             value;

      // Retrieve this integer's value
      value = this.getValue();

      // MQTT 1.5.3: big-endian: high-order byte precedes successively
      // lower-order byte.  We're prepending, so prepend in the opposite
      // order.
      pdu.prepend((value >> 0) & 0xff);
      pdu.prepend((value >> 8) & 0xff);
      pdu.prepend((value >> 16) & 0xff);
      pdu.prepend((value >> 24) & 0xff);

      // Return the length we've prepended
      return 4;
    }
  }
});
