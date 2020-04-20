import { Gauge } from "prom-client";
import { Store } from "redux";
import { Observable } from "rxjs";

export type StateValues = Record<string, any>;

export interface Unsubscribe {
  (): void;
}

export interface RootState {
  getState(): StateValues;
  setValue(path: string, value: any): void;
  subscribe: (listener: () => void) => Unsubscribe;
  store: Store<Record<string, any>, any>;
}

export interface RuleImport {
  import: string;
}

export interface MetricDetails {
  name: string;
  help: string;
  labelNames?: string[];
}

export interface Rules {
  start(): Promise<void>;
  stop(): Promise<void>;
  getState(): StateValues;
  getList(): RuleDetails[];
  getDependencyTree(): {};
}

export interface Reactive {
  getBinding(source: string): Observable<any>;
  getRootBinding(key: string): Observable<any>;
}

export type QoS = 0 | 1 | 2;

export interface EmitOptions {
  /**
   * the QoS
   */
  qos: QoS;
  /**
   * the retain flag
   */
  retain?: boolean;
  /**
   * whether or not mark a message as duplicate
   */
  dup?: boolean;
}

export interface MqttEmitter {
  emit(key: string, value: any, options?: EmitOptions): void;
}

export interface Startable {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export type Metrics = Record<string, Gauge<string>>;

export interface FileState {
  save(state: StateValues): void;
  load(): StateValues;
}

export interface Config {
  rules: (RuleDetails | RuleImport)[];
  metrics: MetricDetails[];
  mqtt: {
    uri: string;
    subscriptions?: string[];
    raw?: string[];
  };
  http: {
    port: number;
  };
  data: {
    file: string;
  };
}

export interface ActivityRule {
  type: "activity";
  sources: string[];
  interval: number;
  delay?: number;
  initial?: boolean;
}

export interface AliasRule {
  type: "alias";
  source: string;
}

export interface AllRule {
  type: "all";
  sources: string[];
}

export interface BoolRule {
  type: "bool";
  source: string;
}

export interface CalculationRule {
  type: "calculation";
  source: string;
  op: ">" | "<" | ">=" | "<=" | "==" | "===";
  value: any;
}

export interface CounterRule {
  type: "counter";
  source: string;
}

export interface DoWRule {
  type: "dayofweek";
  source: string;
  days: number[];
}

export interface DebounceRule {
  type: "debounce";
  source: string;
  interval: number;
}

export interface FilterRule {
  type: "filter";
  source: string;
  regexp: string;
}
export interface LogicalRule {
  sources: string[];
  op: "AND" | "OR";
}

export interface MatchRule {
  type: "match";
  source: string;
  regexp: string;
}

export interface MergeRule {
  type: "merge";
  source: string;
  sources: string[];
}

export interface MinutesSinceRule {
  type: "minutessince";
  source: string;
}

export interface NotRule {
  type: "not";
  source: string;
}

export interface OnOffAutoRule {
  type: "onoffauto";
  source: string;
  auto: string;
}

export interface OnOffRangeRule {
  source: string;
  values: {
    low?: number;
    mid?: number;
    high?: number;
  };
  returns: {
    low?: boolean;
    off?: boolean;
    high?: boolean;
  };
}

export interface PickRule {
  type: "pick";
  source: string;
  field: string;
}

export interface RangeRule {
  type: "range";
  source: string;
  outside?: boolean;
  values: [number, number];
}

export interface SwitchRule {
  type: "switch";
  source: string;
  cases: Record<string, string>;
}

export interface ThrottleRule {
  type: "throttle";
  source: string;
  interval: number;
}

export interface ToggleRule {
  type: "filter";
  source: string;
}

export interface ChainRule {
  type: "chain";
  source: string;
}

export type RuleDetails = (
  | ActivityRule
  | AliasRule
  | AllRule
  | BoolRule
  | CalculationRule
  | CounterRule
  | DoWRule
  | ChainRule
) & {
  key: string;
  import: undefined;
  hidden?: boolean;
  metric?: {
    name: string;
    labels: Record<string, string>;
  };
  source?: string;
  sources?: string[];
  retain?: boolean;
};
// interval?: number;
// sources?: any;
// delay?: number;
// initial?: never;
// import: undefined;
