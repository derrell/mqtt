/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.String",
{
  type : "static",

  statics :
  {
    /**
     * Prepend this object's value to the provided pdu buffer
     *
     * @param {String} value
     *   The value to be formatted and added to the PDU
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
      let             len;

      // Convert the string to UTF-8 and convert it to an array of integer
      // values
      value =
        mqtt.pdu.String.encode(value)
        .split("")
        .map(c => +c.charCodeAt(0));

      // Save the number of bytes
      len = value.length;

      // MQTT 1.5.4? UTF-8 encoded character data is placed into the buffer,
      // preceeded by a 2-byte length
      while (value.length > 0)
      {
        pdu.prepend(value.pop());
      }
      
      // Add the string length
      mqtt.pdu.Uint16.format(len, pdu);
      
      // Return the length we've prepended
      return len + 2;
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
      let             string;

      // Catch buffer overruns. First, we'll retrieve the string length.
      if (pdu.next + 2 > pdu.length)
      {
        throw new Error("Protocol violation: insufficient data");
      }

      // Get the string length
      len = mqtt.pdu.Uint16.parse(pdu, version);

      // Catch buffer overruns. Ensure that length is available
      if (pdu.next + len > pdu.length)
      {
        throw new Error("Protocol violation: insufficient data");
      }

      // Retrieve the string data
      string = pdu.slice(pdu.next, pdu.next + len);

      // Update past the string
      pdu.next += len;

      // Return the decoded string
      return mqtt.pdu.String.decode(string);
    }
  },

  defer : function(statics)
  {
    /*! https://mths.be/utf8js v3.0.0 by @mathias */
    ;(function(root) {

      var stringFromCharCode = String.fromCharCode;

      // Taken from https://mths.be/punycode
      function ucs2decode(string) {
        var output = [];
        var counter = 0;
        var length = string.length;
        var value;
        var extra;
        while (counter < length) {
          value = string.charCodeAt(counter++);
          if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // low surrogate
              output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
              // unmatched surrogate; only append this code unit, in case the next
              // code unit is the high surrogate of a surrogate pair
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }

      // Taken from https://mths.be/punycode
      function ucs2encode(array) {
        var length = array.length;
        var index = -1;
        var value;
        var output = '';
        while (++index < length) {
          value = array[index];
          if (value > 0xFFFF) {
            value -= 0x10000;
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
          }
          output += stringFromCharCode(value);
        }
        return output;
      }

      function checkScalarValue(codePoint) {
        if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
          throw Error(
            'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
              ' is not a scalar value'
          );
        }
      }
      /*----------------------------------------------------------------------*/

      function createByte(codePoint, shift) {
        return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
      }

      function encodeCodePoint(codePoint) {
        if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
          return stringFromCharCode(codePoint);
        }
        var symbol = '';
        if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
          symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
        }
        else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
          checkScalarValue(codePoint);
          symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
          symbol += createByte(codePoint, 6);
        }
        else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
          symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
          symbol += createByte(codePoint, 12);
          symbol += createByte(codePoint, 6);
        }
        symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
        return symbol;
      }

      function utf8encode(string) {
        var codePoints = ucs2decode(string);
        var length = codePoints.length;
        var index = -1;
        var codePoint;
        var byteString = '';
        while (++index < length) {
          codePoint = codePoints[index];
          byteString += encodeCodePoint(codePoint);
        }
        return byteString;
      }

      /*----------------------------------------------------------------------*/

      function readContinuationByte() {
        if (byteIndex >= byteCount) {
          throw Error('Invalid byte index');
        }

        var continuationByte = byteArray[byteIndex] & 0xFF;
        byteIndex++;

        if ((continuationByte & 0xC0) == 0x80) {
          return continuationByte & 0x3F;
        }

        // If we end up here, it’s not a continuation byte
        throw Error('Invalid continuation byte');
      }

      function decodeSymbol() {
        var byte1;
        var byte2;
        var byte3;
        var byte4;
        var codePoint;

        if (byteIndex > byteCount) {
          throw Error('Invalid byte index');
        }

        if (byteIndex == byteCount) {
          return false;
        }

        // Read first byte
        byte1 = byteArray[byteIndex] & 0xFF;
        byteIndex++;

        // 1-byte sequence (no continuation bytes)
        if ((byte1 & 0x80) == 0) {
          return byte1;
        }

        // 2-byte sequence
        if ((byte1 & 0xE0) == 0xC0) {
          byte2 = readContinuationByte();
          codePoint = ((byte1 & 0x1F) << 6) | byte2;
          if (codePoint >= 0x80) {
            return codePoint;
          } else {
            throw Error('Invalid continuation byte');
          }
        }

        // 3-byte sequence (may include unpaired surrogates)
        if ((byte1 & 0xF0) == 0xE0) {
          byte2 = readContinuationByte();
          byte3 = readContinuationByte();
          codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
          if (codePoint >= 0x0800) {
            checkScalarValue(codePoint);
            return codePoint;
          } else {
            throw Error('Invalid continuation byte');
          }
        }

        // 4-byte sequence
        if ((byte1 & 0xF8) == 0xF0) {
          byte2 = readContinuationByte();
          byte3 = readContinuationByte();
          byte4 = readContinuationByte();
          codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
            (byte3 << 0x06) | byte4;
          if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
            return codePoint;
          }
        }

        throw Error('Invalid UTF-8 detected');
      }

      var byteArray;
      var byteCount;
      var byteIndex;
      function utf8decode(byteString) {
        byteArray = ucs2decode(byteString);
        byteCount = byteArray.length;
        byteIndex = 0;
        var codePoints = [];
        var tmp;
        while ((tmp = decodeSymbol()) !== false) {
          codePoints.push(tmp);
        }
        return ucs2encode(codePoints);
      }

      // djl added; clone of utf8decode without initial conversion
      function utf8decodeByteArray(arr) {
        byteArray = arr;
        byteCount = byteArray.length;
        byteIndex = 0;
        var codePoints = [];
        var tmp;
        while ((tmp = decodeSymbol()) !== false) {
          codePoints.push(tmp);
        }
        return ucs2encode(codePoints);
      }

      /*----------------------------------------------------------------------*/

      root.version = '3.0.0';
      root.encode = utf8encode;
//djl      root.decode = utf8decode;
      root.decode = utf8decodeByteArray;

    }(statics));    
  }
});
