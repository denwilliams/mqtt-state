import vm from "vm";
import { Gauge } from "prom-client";
import { RuleConfig } from "./config";
import { BaseContext } from "./events";
import { Metrics } from "./metrics";
import { EmitOptions } from "./mqtt";

export interface RuleContext extends BaseContext {
  key: string;
  update(value: any): void;
}

export class Rule {
  readonly key: string;
  readonly events: string[];
  readonly mqtt?: boolean | EmitOptions;
  readonly gauge?: Gauge<string>;
  private readonly script: vm.Script;

  constructor(details: RuleConfig, metrics: Metrics) {
    this.script = new vm.Script(details.code);
    this.key = details.key;
    this.events = details.events;
    this.mqtt = details.mqtt;

    if (details.metric) {
      this.gauge = metrics.getGauge(details.metric.name);
      if (!this.gauge) {
        this.gauge = new Gauge({
          name: details.metric.name,
          help: details.metric.name,
        });
      }
    }
  }

  exec(context: BaseContext) {
    const set = (value: any) => {
      context.state.set(this.key, value);
    };

    this.script.runInNewContext({
      ...context,
      key: this.key,
      set,
      update: set, // compat
    });
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
