/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.primitive.Uint32",
{
  type : "static",

  statics :
  {
    /**
     * Prepend this object's value to the provided pdu buffer
     *
     * @param {Number} value
     *   The value to be formatted and added to the PDU
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
    format : function(value, pdu, version = 0x05)
    {
      // Validate argument
      qx.core.Assert.assert(
        typeof value == "number" && (value & 0xffffffff) === value,
        "Uint32 value must be a unsigned integer in 0x00000000 - 0xffffffff");
      qx.core.Assert.assertInstance(pdu, mqtt.Buffer);

      // MQTT 1.5.3: big-endian: high-order byte precedes successively
      // lower-order byte.  We're prepending, so prepend in the opposite
      // order.
      pdu.prepend((value >> 0) & 0xff);
      pdu.prepend((value >> 8) & 0xff);
      pdu.prepend((value >> 16) & 0xff);
      pdu.prepend((value >> 24) & 0xff);

      // Return the length we've prepended
      return 4;
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
  }
});
