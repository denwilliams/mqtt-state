import { Gauge } from "prom-client";
import { getFactoryForType } from "./rule-types/factory";
import * as subrules from "./subrules";
import {
  Reactive,
  Rules as IRules,
  StateValues,
  MqttEmitter,
  RuleDetails,
  Metrics,
  QoS,
  ChainRule,
  WithDetails,
  DependencyTree,
  RootState,
} from "./types";
import { Observable } from "rxjs";

export class Rules implements IRules {
  private emitMqtt: boolean = false;
  private state: StateValues = {};
  private dependencyTree: DependencyTree = {};

  constructor(
    private rulesList: RuleDetails[],
    private reactive: Reactive,
    private mqtt: MqttEmitter,
    private rootState: RootState,
    private metrics: Record<string, Gauge<string>>
  ) {
    // for now rules need to appear in dependency order
    for (let rule of rulesList) {
      this.bindRule(rule);
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

  getValue = (path: string) => {
    if (path.startsWith("root/")) return this.rootState.getValue(path);
    return this.state[path];
  };

  getList(): RuleDetails[] {
    return this.rulesList;
  }

  getDependencyTree() {
    return this.dependencyTree;
  }

  private bindRule(rule: RuleDetails) {
    if (rule.type === "chain") {
      return this.bindChain(rule);
    }

    const ruleFactory = getFactoryForType(rule.type);

    if (!ruleFactory) {
      // eslint-disable-next-line no-console
      console.log("No rule factory for", rule.type);
      return;
    }

    const stream: Observable<any> = ruleFactory(
      rule,
      this.reactive,
      this.getValue
    );

    // TODO: move logic to rules
    const dependency = this.dependencyTree[rule.key] || {};
    this.dependencyTree[rule.key] = dependency;
    dependency.hidden = rule.hidden;
    dependency.retain = rule.retain;
    dependency.parents = [];

    const addParent = (parent: string) => {
      dependency.parents.push(parent);
      if (!this.dependencyTree[parent]) {
        this.dependencyTree[parent] = { parents: [] };
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

    const gauge = getMetric(rule, this.metrics);

    const options = {
      qos: 2 as QoS,
      retain: rule.retain,
    };

    stream.subscribe((n) => {
      this.state[rule.key] = n;
      // eslint-disable-next-line no-console
      console.log(rule.key, n);

      if (this.emitMqtt) this.mqtt.emit(rule.key, n, options);

      if (!gauge) return;
      else if (typeof n === "number") gauge.set(n);
      else if (typeof n === "boolean") gauge.set(n ? 1 : 0);
    });
    this.reactive.setBinding(rule.key, stream);

    if (rule.type === "switch") {
      const subruleFactory = subrules[rule.type];
      if (!subruleFactory) return;

      subruleFactory(rule).forEach((r: WithDetails<any>) => this.bindRule(r));
    }
  }

  private bindChain(chain: WithDetails<ChainRule>) {
    const { key: chainKey, source } = chain;
    let index = 0;
    const lastKey = chainKey + "/" + index;
    const nextKey = chainKey + "/" + ++index;

    const rootRule: RuleDetails = { key: lastKey, type: "alias", source };
    this.bindRule(rootRule);
    chain.rules.forEach((rule) => {
      const source = lastKey;
      const key = nextKey;
      this.bindRule(Object.assign({}, rule, { key, source }));
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
    set(value: number) {
      existingMetric.set(labels, value);
    },
  };
}
