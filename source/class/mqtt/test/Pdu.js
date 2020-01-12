qx.Class.define("mqtt.test.Pdu",
{
  extend : qx.dev.unit.TestCase,

  include : [qx.dev.unit.MRequirementsBasic],

  members :
  {
    testBuffer : function()
    {
      let             buf;
      let             data;
      let             correct;

      buf = new mqtt.Buffer(2);
      buf.prepend(1);
      buf.prepend(2);
      buf.prepend(3);
      buf.prepend(4);
      buf.prepend(5);
      data = buf.finalize();

      correct = new Uint8Array(5);
      correct[0] = 1;
      correct[1] = 2;
      correct[2] = 3;
      correct[3] = 4;
      correct[4] = 5;
      this.assertArrayEquals(data, correct);
    }
  }
});
