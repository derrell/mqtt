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

      // Test fixed-size integer functions
      if (false)
      {
        let             pdu;
        let             data;
        let             int;
        let             len = 0;

        pdu = new mqtt.Buffer(16);
        
        len += mqtt.pdu.Uint16.format(0x0102, pdu);
        len += mqtt.pdu.Uint32.format(0x03040506, pdu);

        data = pdu.finalize(true);
        this.debug(`len=${len}, pdu=${data.toString()}`);

        int = mqtt.pdu.Uint32.parse(data);
        this.debug(`parse Uint32=${int}`);

        int = mqtt.pdu.Uint16.parse(data);
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
        
        len += mqtt.pdu.UintVar.format(127, pdu);
        len += mqtt.pdu.UintVar.format(16383, pdu);
        len += mqtt.pdu.UintVar.format(2097151, pdu);
        len += mqtt.pdu.UintVar.format(2097152, pdu);

        data = pdu.finalize(true);
        this.debug(`len=${len}, pdu=${data.toString()}`);

        for (i = 0; i < 4; i++)
        {
          int = mqtt.pdu.UintVar.parse(data);
          this.debug(`parse UintVar=${int}`);
        }
        this.debug("expected 2097152, 2097151, 16383, 127");
      }

      // Test UTF-8 String functions
      if (false)
      {
        let             pdu;
        let             data;
        let             str;
        let             len = 0;

        pdu = new mqtt.Buffer(32);
        
        // expect "\xF0\x90\x80\x81'
        len += mqtt.pdu.String.format("\uD800\uDC01", pdu);

        len += mqtt.pdu.String.format("hello", pdu);

        data = pdu.finalize(true);
        this.debug(`len=${len}, pdu=${data.toString()}`);

        str = mqtt.pdu.String.parse(data);
        this.debug(`parse String=${str}`);
      }
    }
  }
});
