const mqtt = require('mqtt')

exports.create = (rootState, uri, subscriptions, raw) => {
  console.log('Connecting to ' + uri);
  const client  = mqtt.connect(uri);

  client.on('connect', function () {
    console.log('MQTT connected');
    subscriptions.forEach(s => client.subscribe(s));
  });

  client.on('message', function (topic, message) {
    // message is Buffer
    let data = message.toString();

    const topicParts = topic.split('/');
    const lastPart = topicParts[topicParts.length - 1];
    if (!raw.includes(lastPart)) {
      try {
        data = JSON.parse(data);
      } catch(err) {
        // naive error handling
      }
    }

    rootState.setValue('root/' + topic, data);
  });

  return {
    emit(key, value, options) {
      client.publish(key, JSON.stringify(value), options);
    },
    end() {
      client.end();
    }
  };
};
