const { Gauge } = require("prom-client");

const types = require("./rule-types");
const subrules = require("./subrules");

exports.create = (rulesList, reactive, mqtt) => {
  const state = {};
  let emitMqtt = false;

  // for now rules need to appear in dependency order
  rulesList.forEach(bindRule);

  function bindRule(rule) {
    const ruleFactory = types[rule.type];

    if (!ruleFactory) {
      // eslint-disable-next-line no-console
      console.log("No rule factory for", rule.type);
      return;
    }

    const stream = ruleFactory(rule, reactive);

    // const counter = new client.Counter({
    //   name: 'metric_name',
    //   help: 'metric_help'
    // });

    let gauge;
    if (!rule.hidden) {
      gauge = new Gauge({
        name: rule.key.replace(/\//g, "_"),
        help: "metric_help"
      });
    }

    const options = {
      retain: rule.retain
    };

    stream.subscribe(n => {
      state[rule.key] = n;
      // eslint-disable-next-line no-console
      console.log(rule.key, n);

      if (emitMqtt) mqtt.emit(rule.key, n, options);

      if (!gauge) return;
      else if (typeof n === "number") gauge.set(n);
      else if (typeof n === "boolean") gauge.set(n ? 1 : 0);
    });
    reactive.setBinding(rule.key, stream);

    const subruleFactory = subrules[rule.type];
    if (!subruleFactory) return;

    subruleFactory(rule).forEach(bindRule);
  }

  return {
    start() {
      emitMqtt = true;
      // eslint-disable-next-line no-console
      console.log("++ Rules started");
      return Promise.resolve();
    },
    stop() {
      emitMqtt = false;
      // eslint-disable-next-line no-console
      console.log("-- Rules stopped");
      return Promise.resolve();
    },
    getState() {
      return state;
    },
    getList() {
      return rulesList;
    }
  };
};
