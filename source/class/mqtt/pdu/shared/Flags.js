/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.shared.ControlType",
{
  type : "static",

  statics :
  {
    /** Connection request */
    CONNECT         : () => 0b0000,

    /** Connect acknowledgement */
    CONNACK         : () => 0b0000,

    /** Publish message */
    PUBLISH         : (dup, qos, retain) =>
      {
        qx.core.Assert.assert(dup === 0 || dup === 1);
        qx.core.Assert.assert(qos === 0 || qos === 1 || qos === 2);
        qx.core.Assert.assert(retain === 0 || retain === 1);
        
        // qos consumes two bits; others, one bit each
        return (dup << 3 || qos << 1 || retain << 0);
      },
 
    /** Publish acknowledgement (QoS 1) */
    PUBACK          : () => 0b0000,

    /** Publish received (QoS 2 delivery part 1) */
    PUBREC          : () => 0b0000,

    /** Publish release (QoS 2 delivery parr 2) */
    PUBREL          : () => 0b0010,

    /** Publish complete (QoS 2 delivery part 3) */
    PUBCOMP         : () => 0b0000,

    /** Subscribe request */
    SUBSCRIBE       : () => 0b0010,

    /** Subscribe acknowledgement */
    SUBACK          : () => 0b0000,

    /** Unsubscribe request */
    UNSUBSCRIBE     : () => 0b0010,

    /** Unsubscribe acknowledement */
    UNSUBACK        : () => 0b0000,

    /** PING request */
    PINGREQ         : () => 0b0000,

    /** PING response */
    PINGRESP        : () => 0b0000,

    /** Disconnect notification */
    DISCONNECT      : () => 0b0000,

    /** Authentication exchange */
    AUTH            : () => 0b0000
  }
});
