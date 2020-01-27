qx.Class.define("mqtt.test.Test0010_FormatParsePrimitive",
{
  extend : qx.dev.unit.TestCase,

  include : [qx.dev.unit.MRequirementsBasic],

  members :
  {
    "test buffer with finalize true" : function()
    {
      let             buf;
      let             data;
      let             correct;

      buf = new mqtt.Buffer(2);
      [1, 2, 3, 4, 5].forEach((val) => buf.prepend(val));
      data = buf.finalize(true);

      // Convert buffer and typed array to regular array
      data = Array.prototype.slice.apply(data);
      correct = Uint8Array.from( [ 5, 4, 3, 2, 1 ] );
      correct = Array.prototype.slice.apply(correct);
      this.assertArrayEquals(correct, data);
    },

    "test buffer with finalize false" : function()
    {
      let             buf;
      let             data;
      let             correct;

      buf = new mqtt.Buffer(2);
      [1, 2, 3, 4, 5].forEach((val) => buf.prepend(val));
      data = buf.finalize();

      data = Array.prototype.slice.apply(data);
      correct = Uint8Array.from( [ 5, 4, 3, 2, 1 ] );
      correct = Array.prototype.slice.apply(correct);
      this.assertArrayEquals(correct, data);
    },
    
    "test integer fixed-size" : function()
    {
      let             pdu;
      let             int;
      let             got;
      let             data;
      let             correct;
      let             len = 0;

      pdu = new mqtt.Buffer(16);

      // Format two values into the PDU
      len += mqtt.pdu.primitive.Uint16.format(0x0102, pdu);
      len += mqtt.pdu.primitive.Uint32.format(0x03040506, pdu);
      data = pdu.finalize(true);
      
      // Validate that the PDU contains what it should
      got = Array.prototype.slice.apply(data);
      correct = Uint8Array.from( [ 0,0,0,0,0,0,0,0,0,0,3,4,5,6,1,2 ] );
      correct = Array.prototype.slice.apply(correct);
      this.assertArrayEquals(correct, got);

      // Parse the two values and validate they match what we started with
      int = mqtt.pdu.primitive.Uint32.parse(data);
      this.assertIdentical(0x03040506, int);
      int = mqtt.pdu.primitive.Uint16.parse(data);
      this.assertIdentical(0x0102, int);
    },

    "test integer variable-size" : function()
    {
      let             i;
      let             pdu;
      let             int;
      let             got;
      let             data;
      let             correct;
      let             len = 0;

      pdu = new mqtt.Buffer(16);

      // Format four values into the PDU
      len += mqtt.pdu.primitive.UintVar.format(127, pdu);
      len += mqtt.pdu.primitive.UintVar.format(16383, pdu);
      len += mqtt.pdu.primitive.UintVar.format(2097151, pdu);
      len += mqtt.pdu.primitive.UintVar.format(2097152, pdu);

      data = pdu.finalize(true);

      // Validate that the PDU contains what it should
      got = Array.prototype.slice.apply(data);
      correct = Uint8Array.from(
        [ 0,0,0,0,0,0,128,128,128,1,255,255,127,255,127,127 ] );
      correct = Array.prototype.slice.apply(correct);
      this.assertArrayEquals(correct, got);

      // Parse the four values and validate they match what we started with
      int = mqtt.pdu.primitive.UintVar.parse(data);
      this.assertIdentical(2097152, int);

      int = mqtt.pdu.primitive.UintVar.parse(data);
      this.assertIdentical(2097151, int);

      int = mqtt.pdu.primitive.UintVar.parse(data);
      this.assertIdentical(16383, int);

      int = mqtt.pdu.primitive.UintVar.parse(data);
      this.assertIdentical(127, int);
    },

    "test utf-8 string" : function()
    {
      let             pdu;
      let             got;
      let             str;
      let             data;
      let             correct;
      let             len = 0;

      pdu = new mqtt.Buffer(32);

      // expect "\xF0\x90\x80\x81'
      len += mqtt.pdu.primitive.String.format("\uD800\uDC01", pdu);

      len += mqtt.pdu.primitive.String.format("hello", pdu);

      data = pdu.finalize(true);

      // Validate that the PDU contains what it should
      got = Array.prototype.slice.apply(data);
      correct = Uint8Array.from(
        [
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          5,104,101,108,108,111,0,4,240,144,128,129
        ]);
      correct = Array.prototype.slice.apply(correct);
      this.assertArrayEquals(correct, got);

      str = mqtt.pdu.primitive.String.parse(data);
      this.assertEquals("hello", str);

      str = mqtt.pdu.primitive.String.parse(data);
      this.assertEquals("𐀁", str);
    }
  }
});
