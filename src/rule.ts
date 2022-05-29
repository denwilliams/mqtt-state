import vm from "vm";
import { Gauge } from "prom-client";
import { RuleConfig } from "./config";
import { BaseContext } from "./events";
import { Metrics } from "./metrics";
import { EmitOptions } from "./mqtt";
import { RuleState } from "./rule-state";

export interface RuleContext extends BaseContext {
  key: string;
  set(value: any): void;
  setChild(subkey: string, value: any): void;
  currentValue: any;
}

export class Rule {
  readonly key: string;
  readonly distinct: boolean;
  readonly events: string[];
  readonly mqtt?: boolean | EmitOptions;
  readonly gauge?: (value: number) => void;
  private readonly script: vm.Script;
  private readonly setValue: (value: any, subkey?: string) => void;

  constructor(details: RuleConfig, metrics: Metrics, ruleState: RuleState) {
    this.script = new vm.Script(details.source);
    this.key = details.key;
    this.events = Array.isArray(details.subscribe)
      ? details.subscribe
      : [details.subscribe];
    this.mqtt = details.mqtt;
    this.distinct = details.distinct || false;

    if (details.metric) {
      const gauge =
        metrics.getGauge(details.metric.name) ||
        new Gauge({
          name: details.metric.name,
          help: details.metric.name,
        });
      this.gauge = (value: number) => {
        if (details.metric?.labels) gauge.set(details.metric?.labels, value);
        else gauge.set(value);
      };
    }

    this.setValue = (value, subkey) => {
      const key = subkey ? this.key + "/" + subkey : this.key;
      ruleState.set(key, value, this);
    };
  }

  exec(context: BaseContext) {
    const set = (value: any) => {
      this.setValue(value);
    };
    const setChild = (subkey: string, value: any) => {
      this.setValue(value, subkey);
    };
    const ruleContext: RuleContext = {
      ...context,
      key: this.key,
      set,
      setChild,
      currentValue: context.state.get(this.key),
    };

    this.script.runInNewContext(ruleContext);
  }

  getHandler() {
    return (context: BaseContext) => {
      try {
        this.exec(context);
      } catch (err) {
        console.error(
          `Error executing rule key=${this.key} eventName=${context.event.name} err="${err}"`
        );
      }
    };
  }
}
