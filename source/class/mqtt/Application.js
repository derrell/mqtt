/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */
qx.Class.define("mqtt.Application",
{
  extend : qx.application.Basic,

  members :
  {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main : function()
    {
      qx.log.Logger.register(qx.log.appender.NodeConsole);

  
      // Test buffer module
      if (false)
      {
        let             buf;
        let             data;

        buf = new mqtt.Buffer(2);
        buf.prepend(1);
        buf.prepend(2);
        buf.prepend(3);
        buf.prepend(4);
        buf.prepend(5);
        data = buf.finalize();
        this.debug(
          `first=${data.first}, last=${data.last}: ${data.toString()}`);
      }

      // Another buffer module test
      if (true)
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
        data = buf.finalize(true);

        correct = new Uint8Array(5);
        correct[0] = 5;
        correct[1] = 4;
        correct[2] = 3;
        correct[3] = 2;
        correct[4] = 1;
        this.debug(
          `data=${JSON.stringify(data)}, correct=${JSON.stringify(correct)}`);

        data = Array.prototype.slice.apply(data);
        correct = Array.prototype.slice.apply(correct);
        this.assertArrayEquals(data, correct);
      }

      // Test fixed-size integer functions
      if (true)
      {
        let             pdu;
        let             data;
        let             int;
        let             len = 0;

        pdu = new mqtt.Buffer(16);
        
        len += mqtt.pdu.primitive.Uint16.format(0x0102, pdu);
        len += mqtt.pdu.primitive.Uint32.format(0x03040506, pdu);

        data = pdu.finalize(true);
        this.debug(`len=${len}, pdu=${data.toString()}`);
        {
          this.debug(`data=${JSON.stringify(data)}`);
          let x = Array.prototype.slice.apply(data);
          this.debug(`x=${x.toString()}`);
          let y = Uint8Array.from( [ 0,0,0,0,0,0,0,0,0,0,3,4,5,6,1,2 ] );
          y = Array.prototype.slice.apply(y);
          this.debug(`y=${y.toString()}`);
        }

        int = mqtt.pdu.primitive.Uint32.parse(data);
        this.debug(`parse Uint32=${int}`);

        int = mqtt.pdu.primitive.Uint16.parse(data);
        this.debug(`parse Uint16=${int}`);

      }

      // Test variable-size integer function
      if (true)
      {
        let             i;
        let             pdu;
        let             data;
        let             int;
        let             len = 0;

        pdu = new mqtt.Buffer(16);
        
        len += mqtt.pdu.primitive.UintVar.format(127, pdu);
        len += mqtt.pdu.primitive.UintVar.format(16383, pdu);
        len += mqtt.pdu.primitive.UintVar.format(2097151, pdu);
        len += mqtt.pdu.primitive.UintVar.format(2097152, pdu);

        data = pdu.finalize(true);
        this.debug(`len=${len}, pdu=${data.toString()}`);

        for (i = 0; i < 4; i++)
        {
          int = mqtt.pdu.primitive.UintVar.parse(data);
          this.debug(`parse UintVar=${int}`);
        }
        this.debug("expected 2097152, 2097151, 16383, 127");
      }

      // Test UTF-8 String functions
      if (true)
      {
        let             pdu;
        let             data;
        let             str;
        let             len = 0;

        pdu = new mqtt.Buffer(32);
        
        // expect "\xF0\x90\x80\x81'
        len += mqtt.pdu.primitive.String.format("\uD800\uDC01", pdu);

        len += mqtt.pdu.primitive.String.format("hello", pdu);

        data = pdu.finalize(true);
        this.debug(`len=${len}, pdu=${data.toString()}`);

        str = mqtt.pdu.primitive.String.parse(data);
        this.debug(`parse String=${str}`);

        str = mqtt.pdu.primitive.String.parse(data);
        this.debug(`str=${str}`);
      }
    }
  }
});
