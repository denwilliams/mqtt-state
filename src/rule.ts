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
  private readonly throttle?: number;
  private readonly debounce?: number;
  private readonly setValue: (value: any, subkey?: string) => void;

  constructor(details: RuleConfig, metrics: Metrics, ruleState: RuleState) {
    if (!details.key) {
      throw new Error(`Missing key on rule ${details.key}`);
    }
    if (!details.source) {
      throw new Error(`Missing source on rule ${details.key}`);
    }
    if (!details.subscribe) {
      throw new Error(`Missing subscriptions on rule ${details.key}`);
    }

    this.script = new vm.Script(details.source);
    this.key = details.key;
    this.events = Array.isArray(details.subscribe)
      ? details.subscribe
      : [details.subscribe];
    this.mqtt = details.mqtt;
    this.distinct = details.distinct || false;
    this.throttle = details.throttle;
    this.debounce = details.debounce;

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
    const handler = (context: BaseContext) => {
      try {
        this.exec(context);
      } catch (err) {
        console.error(
          `Error executing rule key=${this.key} eventName=${context.event.name} err="${err}"`
        );
      }
    };

    if (this.throttle) return throttle(handler, this.throttle);
    if (this.debounce) return debounce(handler, this.debounce);

    return handler;
  }
}

function debounce(fn: Function, timeout = 1000) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), timeout);
  };
}

function throttle(fn: Function, timeout = 1000) {
  let timer: NodeJS.Timeout | undefined;
  let pendingArgs: any[] | undefined;

  return (...args: any[]) => {
    if (!timer) {
      fn(...args);
    } else {
      pendingArgs = args;
    }

    timer = setTimeout(() => {
      timer = undefined;
      if (!pendingArgs) return;

      fn(...pendingArgs);
      pendingArgs = undefined;
    }, timeout);
  };
}

function debounceLeading(fn: Function, timeout = 1000) {
  let timer: NodeJS.Timeout | undefined;
  return (...args: any[]) => {
    if (!timer) {
      fn(...args);
    } else {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, timeout);
  };
}
