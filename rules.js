const { Counter, Gauge } = require('prom-client');

const types = require('./rule-types');

exports.create = (rulesList, reactive, mqtt) => {
  const state = {};

  // for now rules need to appear in dependency order
  rulesList.forEach(rule => {
    const ruleFactory = types[rule.type];

    if (!ruleFactory) {
      console.log('No rule factory for', rule.type);
      return;
    }

    const stream = ruleFactory(rule, reactive);

    // const counter = new client.Counter({
    //   name: 'metric_name',
    //   help: 'metric_help'
    // });

    let gauge;
    if (!rule.hidden) {
      gauge = new Gauge({ name: rule.key.replace(/\//g, '_'), help: 'metric_help' });
    }

    stream.subscribe(n => {
      state[rule.key] = n;
      console.log(rule.key, n);
      mqtt.emit(rule.key, n);

      if (!gauge) return;
      else if (typeof n === 'number') gauge.set(n);
      else if (typeof n === 'boolean') gauge.set(n ? 1 : 0);
    });
    reactive.setBinding(rule.key, stream);
  });

  return {
    getState() {
      return state;
    }
  };
};
