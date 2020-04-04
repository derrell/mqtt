/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.primitive.UintVar",
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
      let             i = 0;
      let             len = 0;
      let             arr = new Uint8Array(4);

      // Validate argument
      qx.core.Assert.assert(
        typeof value == "number" && (value & 0xffffffff) === value,
        "UintVar value must be a unsigned integer in 0x00000000 - 0xffffffff");
      qx.core.Assert.assertInstance(pdu, mqtt.Buffer);

      // MQTT 1.5.5: variable byte integer: 1, 2, 3, or 4 bytes depending on
      // the integer's value. The high order bit of a byte indicates that
      // there are more bytes of data. The 7 lower bits represent actual
      // data. Note that if one ignores the high bit, this is actually a
      // little-endian encoding whereas Uint16 and Uint32 are big-endian.
      // See MQTT 1.5.5 for algorithm on which this is based.
      do
      {
        let             encodedByte;

        encodedByte = value % 128;
        value = value >> 7;
        if (value > 0)
        {
          encodedByte |= 0x80;
        }
        arr[i++] = encodedByte;
      } while (value > 0);

      len = i - 1;
      while (--i >= 0)
      {
        pdu.prepend(arr[i]);
      }

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
    parse : function(pdu, version = 0x05)
    {
      let             encodedByte;
      let             value = 0;
      let             multiplier = 1;

      // See MQTT 1.5.5 for algorithm on which this is based.
      do
      {
        if (pdu.next >= pdu.length)
        {
          throw new Error("Protocol violation: insufficient data");
        }

        encodedByte = pdu[pdu.next++];
        value += (encodedByte & 0x7f) * multiplier;
        if (multiplier > 128*128*128)
        {
          throw new Error(
            "Protocol violation: malformed variable byte integer");
        }
        multiplier *= 128;
      } while ((encodedByte & 128) !== 0);

      return value;
    }    
  }
});
