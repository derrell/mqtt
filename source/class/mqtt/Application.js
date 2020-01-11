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
      let             buf;
      let             data;

      qx.log.Logger.register(qx.log.appender.NodeConsole);

      buf = new mqtt.Buffer(2);
      buf.prepend(1);
      buf.prepend(2);
      buf.prepend(3);
      buf.prepend(4);
      buf.prepend(5);
      data = buf.finalize();
      this.debug(`first=${data.first}, last=${data.last}: ${data.toString()}`);
    }
  }
});
