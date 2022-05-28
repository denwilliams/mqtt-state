import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import consul from "consul";
import yaml from "js-yaml";
import { EmitOptions } from "./mqtt";

const readFileAsync = promisify(readFile);

export interface RuleConfig {
  /** Event key/name/topic to emit on  */
  key: string;
  /** Events keys/names to subscribe to. These can be subscribed MQTT topics, or internal state changes. */
  events: string[];
  /** Javascript code to execute when subscribed events occur. */
  code: string;
  /** Set to false to not emit over MQTT, true to emit, or an object with MQTT options. Default true. */
  mqtt?: boolean | EmitOptions;
}

export interface Config {
  mqtt: {
    uri: string;
    subscriptions: string[];
    raw: string[];
  };
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
