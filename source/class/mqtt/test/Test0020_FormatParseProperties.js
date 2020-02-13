qx.Class.define("mqtt.test.Test0020_FormatParseProperties",
{
  extend : qx.dev.unit.TestCase,

  include : [qx.dev.unit.MRequirementsBasic, qx.dev.unit.MMock],

  members :
  {
    "test: property PayloadFormatIndicator" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.PayloadFormatIndicator;
      const           test = 0x23;

      pdu = new mqtt.Buffer(4);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property PayloadFormatIndicator with bad input" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.PayloadFormatIndicator;
      const           test = 0x2369;

      this.assertException(
        () =>
          {
            pdu = new mqtt.Buffer(4);
            len = Property.format(
              {
                id    : id,
                value : test
              },
              pdu);
            data = pdu.finalize();
          });
    },

    "test: property MessageExpiryInterval" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.MessageExpiryInterval;
      const           test = 0x23694287;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property ContentType" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.ContentType;
      const           test = "application/json";

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property ResponseTopic" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.ResponseTopic;
      const           test = "my-topic";

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property CorrelationData" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.CorrelationData;
      const           testArr = [ 2, 4, 6, 8, 10 ];
      const           testUint8Arr = Uint8Array.from(testArr);

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : testUint8Arr
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);
      this.assertIdentical(id, value.id);
      this.assertArrayEquals(testArr, Array.from(value.value));
    },

    "test: property SubscriptionIdentifier" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.SubscriptionIdentifier;
      const           test = 0x236942;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property SessionExpiryInterval" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.SessionExpiryInterval;
      const           test = 0x23694287;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property AssignedClientIdentifier" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.AssignedClientIdentifier;
      const           test = "I am a client!";

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property ServerKeepAlive" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.ServerKeepAlive;
      const           test = 0x4223;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property AuthenticationMethod" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.AuthenticationMethod;
      const           test = "the best auth algorithm";

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property RequestProblemInformation" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.RequestProblemInformation;
      const           test = 0x42;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property WillDelayInterval" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.WillDelayInterval;
      const           test = 0x23426987;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property RequestResponseInformation" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.RequestResponseInformation;
      const           test = 0x23;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property ResponseInformation" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.ResponseInformation;
      const           test = "My response information";

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property ServerReference" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.ServerReference;
      const           test = "qooxdoo mqtt server";

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property ReasonString" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.ReasonString;
      const           test = "it's broken!";

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property ReceiveMaximum" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.ReceiveMaximum;
      const           test = 0x4223;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property TopicAliasMaximum" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.TopicAliasMaximum;
      const           test = 0x4223;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property TopicAlias" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.TopicAlias;
      const           test = 0x4223;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property MaximumQoS" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.MaximumQoS;
      const           test = 0x23;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property RetainAvailable" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.RetainAvailable;
      const           test = 0x23;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property UserProperty" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.UserProperty;
      const           test = [ "key", "value" ];

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertArrayEquals(test, Array.from(value.value));
    },

    "test: property MaximumPacketSize" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.MaximumPacketSize;
      const           test = 0x23426987;

      pdu = new mqtt.Buffer(32);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property WildcardSubscriptionAvailable" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.WildcardSubscriptionAvailable;
      const           test = 0x23;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property SubscriptionIdentifierAvailable" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.SubscriptionIdentifierAvailable;
      const           test = 0x23;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    },

    "test: property SharedSubscriptionAvailable" : function()
    {
      let             len;
      let             pdu;
      let             data;
      let             value;
      const           Property = mqtt.pdu.shared.Property;
      const           id = Property.SharedSubscriptionAvailable;
      const           test = 0x23;

      pdu = new mqtt.Buffer(8);
      len = Property.format(
        {
          id    : id,
          value : test
        },
        pdu);
      data = pdu.finalize();

      // Parse the pdu
      value = Property.parse(data);

      this.assertIdentical(id, value.id);
      this.assertIdentical(test, value.value);
    }
  }
});

