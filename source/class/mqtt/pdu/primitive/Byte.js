/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.primitive.Byte",
{
  type : "static",

  statics :
  {
    /**
     * Format this object's value into the provided pdu buffer
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
        typeof value == "number" && (value & 0xff) === value,
        "Byte value must be a unsigned integer in 0x00 - 0xff");
      qx.core.Assert.assertInstance(pdu, mqtt.Buffer);

      // Prepend the byte value to the PDU
      pdu.prepend(value & 0xff);

      // Return the length we've prepended
      return 1;
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
      if (pdu.next + 1 > pdu.length)
      {
        throw new Error("Protocol violation: insufficient data");
      }

      return (pdu[pdu.next++]);
    }    
  }
});
