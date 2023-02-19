import vm from "vm";
import { Gauge } from "prom-client";
import { RuleConfig, RuleMetric } from "./config";
import { BaseContext } from "./events";
import { Metrics } from "./metrics";
import { EmitOptions } from "./mqtt";
import { RuleState } from "./rule-state";
import { Template } from "./template";

export interface RuleContext extends BaseContext {
  key: string;
  set(value: any): void;
  setChild(subkey: string, value: any): void;
  /** The current (last known) value for this rule */
  currentValue: any;
  /** A list of event keys this rule is subscribed to */
  subscriptions: string[];
  /** Static parameters for this rule */
  params?: Record<string, any>;
}

type GaugeFn = (value: number) => void;

function createGauge(metric: RuleMetric, metrics: Metrics): GaugeFn {
  const gauge =
    metrics.getGauge(metric.name) ||
    new Gauge({
      name: metric.name,
      help: metric.name,
      labelNames: metric.labels ? Object.keys(metric.labels) : undefined,
    });

  return (value: any) => {
    let metricValue: number | undefined = undefined;

    if (typeof value === "number") metricValue = value;
    else if (typeof value === "boolean") metricValue = value ? 1 : 0;

    if (metricValue === undefined) {
      console.warn(
        `Ignored invalid metric update name=${
          metric.name
        } value=${JSON.stringify(value)}`
      );
      return;
    }

    if (metric.labels) {
      gauge.set(metric.labels, metricValue);
    } else {
      gauge.set(metricValue);
    }
  };
}

export interface RuleOptions {
  readonly distinct: boolean;
  readonly mqtt?: boolean | EmitOptions;
  readonly gauge?: GaugeFn;
}

export class Rule implements RuleOptions {
  readonly key: string;
  readonly distinct: boolean;
  readonly events: string[];
  readonly mqtt?: boolean | EmitOptions;
  readonly gauge?: GaugeFn;
  readonly children?: Record<string, RuleOptions>;
  private readonly params?: Record<string, any>;
  private readonly script: vm.Script;
  private readonly throttle?: number;
  private readonly debounce?: number;
  private readonly setValue: (value: any, subkey?: string) => void;

  // TODO: don't like this pattern of injecting Metrics etc. Need to refactor and find a better way.
  constructor(
    details: RuleConfig,
    metrics: Metrics,
    ruleState: RuleState,
    template?: Template,
    initialValue?: any
  ) {
    if (!details.key) {
      throw new Error(`Missing key on rule ${details.key}`);
    }
    if (!details.source && !template) {
      throw new Error(`Missing source on rule ${details.key}`);
    }
    if (!details.subscribe) {
      throw new Error(`Missing subscriptions on rule ${details.key}`);
    }

    this.script = details.source
      ? new vm.Script(details.source)
      : template!.script;
    this.key = details.key;
    this.events = Array.isArray(details.subscribe)
      ? details.subscribe
      : [details.subscribe];
    this.mqtt = details.mqtt;
    this.distinct = details.distinct || false;
    this.throttle = details.throttle;
    this.debounce = details.debounce;
    this.params = details.params;

    if (details.metric) {
      this.gauge = createGauge(details.metric, metrics);
    }

    if (details.children) {
      this.children = {};
      for (const [key, child] of Object.entries(details.children)) {
        this.children[key] = {
          distinct: child.distinct || false,
          mqtt: child.mqtt,
          gauge: child.metric ? createGauge(child.metric, metrics) : undefined,
        };
      }
    }

    this.setValue = (value, subkey) => {
      const key = subkey ? this.key + "/" + subkey : this.key;
      const ruleOptions = subkey ? this.children?.[subkey] ?? this : this;
      ruleState.set(key, value, ruleOptions);
    };

    if (initialValue !== undefined && this.gauge) {
      this.gauge(initialValue);
    }
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
      subscriptions: this.events,
      params: this.params,
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
      timer = setTimeout(() => {
        timer = undefined;
        if (!pendingArgs) return;

        fn(...pendingArgs);
        pendingArgs = undefined;
      }, timeout);
    } else {
      pendingArgs = args;
    }
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
