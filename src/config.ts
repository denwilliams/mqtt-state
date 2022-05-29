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

export interface RuleConfig {
  /** Event key/name/topic to emit on  */
  key: string;
  /** Events keys/names to subscribe to. These can be subscribed MQTT topics, or internal state changes. */
  subscribe: string | string[];
  /** Javascript code to execute when subscribed events occur. */
  source: string;
  /** Set to false to not emit over MQTT, true to emit, or an object with MQTT options. Default true. */
  mqtt?: boolean | EmitOptions;
  /** If defined a metric will be published for value updates on this rule. */
  metric?: RuleMetric;
  /** If true then set values will only be processed if changed from the previous value */
  distinct?: boolean;
  /** Throttle execution of this rule to once per the number of ms if defined */
  throttle?: number;
  /** Debounce execution of this rule by the number of ms if defined */
  debounce?: number;
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
    changes?: boolean;
  };
  metrics?: MetricDetails[];
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
