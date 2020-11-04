import { Gauge } from "prom-client";
import { Store } from "redux";
import { Observable } from "rxjs";

export type StateValues = Record<string, any>;

interface Dependency {
  hidden?: boolean;
  retain?: boolean;
  parents: string[];
}

export type DependencyTree = Record<string, Dependency>;

export interface Unsubscribe {
  (): void;
}

export interface RootState {
  getState(): StateValues;
  getValue(path: string): any | undefined;
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
  getDependencyTree(): DependencyTree;
}

export interface Reactive {
  state$: Observable<Record<string, any>>;
  getBinding(source: string): Observable<any>;
  getRootBinding(key: string): Observable<any>;
  setBinding(path: string, stream: Observable<any>): void;
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

export interface PersistedState {
  save(state: StateValues): void;
  load(): Promise<StateValues>;
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

export interface BaseRule {
  type: string;
  source?: string;
  sources?: string[] | Record<string, string>;
}

export interface ActivityRule {
  type: "activity";
  /** If only 1 source */
  source?: string;
  /** If multiple sources or reset... list of sources to subscribe to */
  sources?: string[] | Record<string, string>;
  interval: number;
  delay?: number;
  initial?: boolean;
}

export interface AliasRule {
  type: "alias";
  source: string;
  sources?: undefined;
  distinct?: boolean;
}

export interface AllRule {
  type: "all";
  source?: undefined;
  sources: string[];
}

export interface BoolRule {
  type: "bool";
  source: string;
  sources?: undefined;
}

export interface CalculationRule {
  type: "calculation";
  source: string;
  sources?: undefined;
  op: ">" | "<" | ">=" | "<=" | "==" | "===";
  value: any;
}

export interface CounterRule {
  key: string;
  type: "counter";
  source: string;
  sources?: undefined;
}

export interface DoWRule {
  type: "dayofweek";
  source: string;
  sources?: undefined;
  days: number[];
}

export interface DebounceRule {
  type: "debounce";
  source: string;
  sources?: undefined;
  interval: number;
}

export interface FilterRule {
  type: "filter";
  source: string;
  sources?: undefined;
  /** Filter using this regular expression */
  regexp?: string;
  /** Filter using the eq */
  eq?: boolean | number | string;
}

export interface ExpressionRule {
  type: "expression";
  /** Provide either a single source */
  source?: string;
  /** Or provide a set of sources */
  sources?: Record<string, string>;
  expression: string;
  distinct?: boolean;
  /** If true then undefined input values (including initial values) are not processed by the expression */
  ignore_undefined?: boolean;
  /** If true then null input values are not processed by the expression */
  ignore_null?: boolean;
}

export interface JsonRule {
  type: "json";
  source: string;
  sources?: undefined;
}

export interface LogicalRule {
  type: "logical";
  source?: undefined;
  sources: string[];
  op: "AND" | "OR";
}

export interface MatchRule {
  type: "match";
  source: string;
  sources?: undefined;
  regexp: string;
}

export interface MergeRule {
  type: "merge";
  source?: undefined;
  sources: string[];
}

export interface MergeSwitchRule {
  type: "merge-switch";
  source?: undefined;
  sources?: undefined;
  /** Only emits a value when changed */
  distinct?: boolean;
  cases: {
    source: string;
    value: string | number;
    /** Matches using this regular expression */
    regexp?: string;
    /** Matches exactly this value (===) */
    eq?: boolean | string | number;
  }[];
}

export interface MinutesSinceRule {
  type: "minutes-since";
  source: string;
  sources?: undefined;
}

export interface NotRule {
  type: "not";
  source: string;
  sources?: undefined;
  distinct?: boolean;
}

export interface NumberRule {
  type: "number";
  source: string;
  sources?: undefined;
  distinct?: boolean;
}

export interface OnOffAutoRule {
  type: "onoffauto";
  source: string;
  sources?: undefined;
  auto: string;
}

export interface OnOffRangeRule {
  type: "onoffrange";
  source: string;
  sources?: undefined;
  values: {
    low?: number;
    mid: number;
    high?: number;
  };
  returns: {
    low?: boolean;
    off?: boolean;
    high?: boolean;
  };
}

export type ParallelSwitchCase =
  | ActivityRule
  | AliasRule
  | BoolRule
  | CalculationRule
  | DoWRule
  | DebounceRule
  | LogicalRule
  | NotRule
  | FilterRule
  | MatchRule
  | MergeRule
  | MergeSwitchRule
  | OnOffRangeRule
  | PickRule
  | RangeRule
  | SwitchRule
  | ThrottleRule
  | ToDRule;

export interface ParallelSwitchRule {
  type: "parallel-switch";
  source: string;
  sources?: undefined;
  cases: Record<string, ParallelSwitchCase>;
}

export interface PickRule {
  type: "pick";
  source: string;
  sources?: undefined;
  distinct?: boolean;
  field: string;
}

export interface RangeRule {
  type: "range";
  source: string;
  sources?: undefined;
  outside?: boolean;
  values: [number, number];
}

export interface SwitchRule {
  type: "switch";
  source: string;
  sources?: undefined;
  cases: Record<string, string>;
}

export interface ThrottleRule {
  type: "throttle";
  source: string;
  sources?: undefined;
  interval: number;
}

export interface ToggleRule {
  type: "filter";
  source: string;
  toggle_source?: string;
  set_source?: string;
  sources?: undefined;
}

export interface ToDRule {
  type: "timeofday";
  source: string;
  sources?: undefined;
  outside?: boolean;
  values: [number, number];
}

export interface ChainRule {
  type: "chain";
  source: string;
  sources?: undefined;
  rules: Rule[];
}

export type Rule =
  | ChainRule
  | ActivityRule
  | AliasRule
  | AllRule
  | BoolRule
  | CalculationRule
  | CounterRule
  | DebounceRule
  | DoWRule
  | FilterRule
  | JsonRule
  | LogicalRule
  | MatchRule
  | MergeRule
  | MergeSwitchRule
  | MinutesSinceRule
  | NotRule
  | NumberRule
  | OnOffAutoRule
  | OnOffRangeRule
  | PickRule
  | RangeRule
  | SwitchRule
  | ToDRule
  | ThrottleRule
  | ToggleRule;

export type RuleOptions = {
  key: string;
  import?: undefined;
  hidden?: boolean;
  metric?: {
    name: string;
    labels: Record<string, string>;
  };
  source?: string;
  sources?: string[] | Record<string, string>;
  retain?: boolean;
};

export type WithDetails<T> = T & RuleOptions;

export type RuleDetails = WithDetails<Rule>;

// interval?: number;
// sources?: any;
// delay?: number;
// initial?: never;
// import: undefined;
