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
    /**
     * Connection request
     * client->server
     */
    CONNECT         : 1,

    /**
     * Connect acknowledgement
     * server->client
     */
    CONNACK         : 2,

    /**
     * Publish message
     * client->server or server->client
     */
    PUBLISH         : 3,
 
    /**
     * Publish acknowledgement (QoS 1)
     * client->server or server->client
     */
    PUBACK          : 4,

    /**
     * Publish received (QoS 2 delivery part 1)
     * client->server or server->client
     */
    PUBREC          : 5,

    /**
     * Publish release (QoS 2 delivery parr 2)
     * client->server or server->client
     */
    PUBREL          : 6,

    /**
     * Publish complete (QoS 2 delivery part 3)
     * client->server or server->client
     */
    PUBCOMP         : 7,

    /**
     * Subscribe request
     * client->server
     */
    SUBSCRIBE       : 8,

    /**
     * Subscribe acknowledgement
     * server->client
     */
    SUBACK          : 9,

    /**
     * Unsubscribe request
     * client->server
     */
    UNSUBSCRIBE     : 10,

    /**
     * Unsubscribe acknowledement
     * server->client
     */
    UNSUBACK        : 11,

    /**
     * PING request
     * client->server
     */
    PINGREQ         : 12,

    /**
     * PING response
     * server->client
     */
    PINGRESP        : 13,

    /**
     * Disconnect notification
     * client->server or server->client
     */
    DISCONNECT      : 14,

    /**
     * Authentication exchange
     * client->server or server->client
     */
    AUTH            : 15
  }
});
