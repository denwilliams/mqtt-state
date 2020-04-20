import { Gauge } from "prom-client";
import * as types from "./rule-types";
import * as subrules from "./subrules";
import {
  Reactive,
  Rules as IRules,
  StateValues,
  MqttEmitter,
  RuleDetails,
  Metrics,
} from "./types";

export class Rules implements IRules {
  private emitMqtt: boolean = false;
  private state: StateValues = {};
  private dependencyTree = {};

  constructor(
    private rulesList: RuleDetails[],
    reactive: Reactive,
    mqtt: MqttEmitter,
    metrics: Record<string, Gauge<string>>
  ) {
    // for now rules need to appear in dependency order
    for (let rule of rulesList) {
      this.bindRule(rule, reactive);
    }
  }

  start() {
    this.emitMqtt = true;
    // eslint-disable-next-line no-console
    console.log("++ Rules started");
    return Promise.resolve();
  }

  stop() {
    this.emitMqtt = false;
    // eslint-disable-next-line no-console
    console.log("-- Rules stopped");
    return Promise.resolve();
  }

  getState() {
    return this.state;
  }

  getList(): RuleDetails[] {
    return this.rulesList;
  }

  getDependencyTree() {
    return this.dependencyTree;
  }

  private bindRule(rule: RuleDetails, reactive: Reactive) {
    const { type: ruleType } = rule;
    if (ruleType === "chain") {
      return bindChain(rule);
    }

    const ruleFactory = types[ruleType];

    if (!ruleFactory) {
      // eslint-disable-next-line no-console
      console.log("No rule factory for", rule.type);
      return;
    }

    const stream = ruleFactory(rule, reactive);

    // TODO: move logic to rules
    const dependency = dependencyTree[rule.key] || {};
    dependencyTree[rule.key] = dependency;
    dependency.hidden = rule.hidden;
    dependency.retain = rule.retain;
    dependency.parents = [];
    const addParent = (parent) => {
      dependency.parents.push(parent);
      if (!dependencyTree[parent]) {
        dependencyTree[parent] = { parents: [] };
      }
    };
    if (rule.source) {
      addParent(rule.source);
    }
    if (rule.sources) {
      if (Array.isArray(rule.sources)) {
        rule.sources.forEach(addParent);
      } else {
        Object.keys(rule.sources).forEach(addParent);
      }
    }
    // END TODO:

    // TODO: subrules

    // const counter = new client.Counter({
    //   name: 'metric_name',
    //   help: 'metric_help'
    // });

    const gauge = getMetric(rule, metrics);

    const options = {
      qos: 2,
      retain: rule.retain,
    };

    stream.subscribe((n) => {
      state[rule.key] = n;
      // eslint-disable-next-line no-console
      console.log(rule.key, n);

      if (this.emitMqtt) mqtt.emit(rule.key, n, options);

      if (!gauge) return;
      else if (typeof n === "number") gauge.set(n);
      else if (typeof n === "boolean") gauge.set(n ? 1 : 0);
    });
    reactive.setBinding(rule.key, stream);

    const subruleFactory = subrules[rule.type];
    if (!subruleFactory) return;

    subruleFactory(rule).forEach(bindRule);
  }

  private bindChain(chain) {
    const { key: chainKey, source } = chain;
    let index = 0;
    const lastKey = () => chainKey + "/" + index;
    const nextKey = () => chainKey + "/" + ++index;

    bindRule({ key: lastKey(), type: "alias", source });
    chain.rules.forEach((rule) => {
      const source = lastKey();
      const key = nextKey();
      bindRule(Object.assign({}, rule, { key, source }));
    });
  }
}

function getMetric(rule: RuleDetails, metrics: Metrics) {
  if (rule.hidden) return null;

  if (!rule.metric) {
    return new Gauge({
      name: rule.key.replace(/\//g, "_"),
      help: "metric_help",
    });
  }

  const existingMetric = metrics[rule.metric.name];
  const labels = rule.metric.labels;

  return {
    /**
     * @param {any} value
     */
    set(value) {
      existingMetric.set(labels, value);
    },
  };
}
