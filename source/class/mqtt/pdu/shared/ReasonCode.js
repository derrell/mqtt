/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.pdu.shared.ReasonCode",
{
  type : "static",

  statics :
  {
    /** CONNACK, PUBACK, PUBREC, PUBREL, PUBCOMP, UNSUBACK, AUTH */
    Success                               : 0x00,

    /** DISCONNECT */
    NormalDisconnect                      : 0x00,

    /** SUBACK */
    GrantedQoS0                           : 0x00,

    /** SUBACK */
    GrantedQoS1                           : 0x01,

    /** SUBACK */
    GrantedQoS2                           : 0x02,

    /** DISCONNECT */
    DisconnectWithWillMessage             : 0x04,

    /** PUBACK, PUBREC */
    NoMatchingSubscribers                 : 0x10,

    /** UNSUGACK */
    NoSubscriptionExisted                 : 0x11,

    /** AUTH */
    ContinueAuthentication                : 0x18,

    /** AUTH */
    Reauthenticate                        : 0x19,

    /** CONNACK, PUBACK, PUBREC, SUBACK, UNSUBACK, DISCONNECT */
    UnspecifiedError                      : 0x80,

    /** CONNACK, DISCONNECT */
    MalformedPacket                       : 0x81,

    /** CONNACK, DISCONNECT */
    ProtocolError                         : 0x82,

    /** CONNACK, PUBACK, PUBREC, SUBACK, UNSUBACK, DISCONNECT */
    ImplementationSpecificError           : 0x83,

    /** CONNACK */
    UnsupportedProtocolVersion            : 0x84,

    /** CONNACK */
    ClientIdentifierNotValid              : 0x85,

    /** CONNACK */
    BadUserNameOrPassword                 : 0x86,

    /** CONNACK, PUBACK, PUBREC, SUBACK, UNSUBACK, DISCONNECT */
    NotAuthorized                         : 0x87,

    /** CONNACK */
    ServerUnavailable                     : 0x88,

    /** CONNACK, DISCONNECT */
    ServerBusy                            : 0x89,

    /** CONNACK */
    Banned                                : 0x8a,

    /** DISCONNECT */
    ServerShuttingDown                    : 0x8b,

    /** CONNACK, DISCONNECT */
    BadAuthenticationMethod               : 0x8c,

    /** DISCONNECT */
    KeepAliveTimeout                      : 0x8d,

    /** DISCONNECT */
    SessionTakenOver                      : 0x8e,

    /** SUBACK, UNSUBACK, DISCONNECT */
    TopicFilterInvalid                    : 0x8f,

    /** CONNACK, PUBACK, PUBREC, DISCONNECT */
    TopicNameInvalid                      : 0x90,

    /** PUBACK, PUBREC, SUBACK, UNSUBACK */
    PacketIdentifierInUse                 : 0x91,

    /** PUBREL, PUBCOMP */
    PacketIdentifierNotFound              : 0x92,

    /** DISCONNECT */
    ReceiveMaximumExceeded                : 0x93,

    /** DISCONNECT */
    TopicAliasInvalid                     : 0x94,

    /** CONNACK, DISCONNECT */
    PacketTooLarge                        : 0x95,

    /** DISCONNECT */
    MessageRateTooHigh                    : 0x96,

    /** CONNACK, PUBACK, PUBREC, SUBACK, DISCONNECT */
    QuotaExceeded                         : 0x97,

    /** DISCONNECT */
    AdministrativeAction                  : 0x98,

    /** CONNACK, PUBACK, PUBREC, DISCONNECT */
    PayloadFormatInvalid                  : 0x99,

    /** CONNACK, DISCONNECT */
    RetainNotSupported                    : 0x9a,

    /** CONNACK, DISCONNECT */
    QoSNotSupported                       : 0x9b,

    /** CONNACK, DISCONNECT */
    UseAnotherServer                      : 0x9c,

    /** CONNACK, DISCONNECT */
    ServerMoved                           : 0x9d,

    /** SUBACK, DISCONNECT */
    SharedSubscriptionsNotSupported       : 0x9e,

    /** CONNACK, DISCONNECT */
    ConnectionRateExeeded                 : 0x9f,

    /** DISCONNECT */
    MaximumConnectTime                    : 0xa0,

    /** SUBACK, DISCONNECT */
    SubscriptionIdentifiersNotSupported   : 0xa1,

    /** SUBACK, DISCONNECT */
    WildcardSubscriptionsNotSupported     : 0xa2
  }
});
