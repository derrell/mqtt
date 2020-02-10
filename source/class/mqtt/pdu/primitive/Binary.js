/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.primitive.Binary",
{
  type : "static",

  statics :
  {
    /**
     * Format this object's value into the provided pdu buffer
     *
     * @param {Number} value
     *   The value to be formatted and added to the PDU. The value must be a
     *   Uint8Array.
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
    format : function(value, pdu, version = 5.0)
    {
      let             i;
      let             len;

      qx.core.Assert.assertInstance(
        value,
        Uint8Array,
        "Binary data must be provided in the form of a Uint8Array");
      qx.core.Assert.assertInstance(pdu, mqtt.Buffer);
      
      // Get the binary data length
      len = value.length;

      // Prepend the value
      for (i = len - 1; i >= 0; i--)
      {
        pdu.prepend(value[i] & 0xff);
      }

      // prepend the length
      len += mqtt.pdu.primitive.Uint16.format(len, pdu, version);

      // Return the length we've prepended
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
      let             len;
      let             value;

      // Retrieve the length of the binary data
      len = mqtt.pdu.primitive.Uint16.parse(pdu, version);
      // Catch buffer overruns
      if (pdu.next + len  > pdu.length)
      {
        throw new Error("Protocol violation: insufficient data");
      }

      // Retrieve the value
      value = pdu.slice(pdu.next, pdu.next + len);
      pdu.next += len;

      return value;
    }    
  }
});
