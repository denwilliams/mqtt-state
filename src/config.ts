import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import consul from "consul";
import yaml from "js-yaml";
import { EmitOptions } from "./mqtt";

const readFileAsync = promisify(readFile);

export interface RuleMetric {
  /** If this matches a shared metric name it will be used, else a new one created. */
  name: string;
  /** Label values to use for a shared metric. */
  labels?: Record<string, string>;
}

export interface BasicRuleConfig {
  /** Set to false to not emit over MQTT, true to emit, or an object with MQTT options. Default true. */
  mqtt?: boolean | EmitOptions;
  /** If defined a metric will be published for value updates on this rule. */
  metric?: RuleMetric;
  /** If true then set values will only be processed if changed from the previous value */
  distinct?: boolean;
}

export interface TemplateSelection {
  /** The id of the template to apply */
  id: string;
  /** Label values to pass through to the template */
  labels?: Record<string, string>;
}

export interface RuleConfig extends BasicRuleConfig {
  /** Event key/name/topic to emit on  */
  key: string;
  /** Events keys/names to subscribe to. These can be subscribed MQTT topics, or internal state changes. */
  subscribe: string | string[];
  /** Throttle execution of this rule to once per the number of ms if defined */
  throttle?: number;
  /** Debounce execution of this rule by the number of ms if defined */
  debounce?: number;
  /** Javascript code to execute when subscribed events occur. If not provided then a template must be used. */
  source?: string;
  /** Template (ID) to use if source not provided. */
  template?: string | TemplateSelection;
  /** Optional parameters to pass to the template or rule source. */
  params?: Record<string, any>;
  /** Optional child outputs for the rule */
  children?: Record<string, BasicRuleConfig>;
}

export interface TemplateMetric {
  /** If this matches a shared metric name it will be used, else a new one created. */
  name: string;
  /** Label values to pass through from the rule. */
  labels?: string[];
}

export interface TemplateChildConfig {
  /** Set to false to not emit over MQTT, true to emit, or an object with MQTT options. Default true. */
  mqtt?: boolean | EmitOptions;
  /** If true then set values will only be processed if changed from the previous value */
  distinct?: boolean;
  /** If defined a metric will be published for value updates on this rule. */
  metric?: TemplateMetric;
}

export interface TemplateConfig {
  /** Template unique ID  */
  id: string;
  /** Javascript code to execute when rule using this template is executed. */
  source: string;
  /** Set to false to not emit over MQTT, true to emit, or an object with MQTT options. Default true. */
  mqtt?: boolean | EmitOptions;
  /** If true then set values will only be processed if changed from the previous value */
  distinct?: boolean;
  /** If defined a metric will be published for value updates on this rule. */
  metric?: TemplateMetric;
  /** Optional child outputs for the template */
  children?: Record<string, TemplateChildConfig>;
}

export interface MetricDetails {
  name: string;
  help: string;
  labelNames?: string[];
}

export interface Config {
  mqtt: {
    uri: string;
    subscriptions: string[];
    raw: string[];
  };
  http?: {
    port: number;
  };
  log?: {
    rules?: boolean;
    changes?: boolean;
  };
  data?: {
    file?: {
      path: string;
    };
    redis?: {
      url: string;
      key?: string;
    };
    saveInterval?: number;
  };
  metrics?: MetricDetails[];
  templates?: Array<TemplateConfig>;
  rules: Array<RuleConfig>;
}

export async function loadConfig(): Promise<Config> {
  if (process.env.CONSUL_KEY) return getConsulConfig(process.env.CONSUL_KEY);
  return getFileConfig();
}

async function getConsulConfig(key: string) {
  const consulClient = consul({ promisify: true });
  const result: { Value: string } = await consulClient.kv.get(key);
  const serialized = result.Value;

  if (serialized[0] === "{") return JSON.parse(result.Value);
  return yaml.safeLoad(serialized);
}

async function getFileConfig() {
  const configPath =
    process.env.CONFIG_PATH || join(__dirname, "..", "/config.yml");
  const config: Config = yaml.safeLoad(await readFileAsync(configPath, "utf8"));
  return config;
}
