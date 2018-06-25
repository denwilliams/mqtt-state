const mqtt = require('mqtt')

exports.create = (rootState, uri, subscriptions) => {
  console.log('Connecting to ' + uri);
  const client  = mqtt.connect(uri);

  client.on('connect', function () {
    console.log('MQTT connected');
    subscriptions.forEach(s => client.subscribe(s));
  });

  client.on('message', function (topic, message) {
    // message is Buffer
    const str = message.toString();
    try {
      rootState.setValue('root/' + topic, JSON.parse(str));
    } catch(err) {
      // naive error handling
      rootState.setValue('root/' + topic, str);
    }
  });

  return {
    emit(key, value) {
      client.publish(key, JSON.stringify(value));
    },
    end() {
      client.end();
    }
  };
};
