import consul from "consul";
import { readFile } from "fs";
import yaml from "js-yaml";
import { promisify } from "util";

import { Config } from "./types";

const readFileAsync = promisify(readFile);

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
  const configPath = process.env.CONFIG_PATH || __dirname + "/config.yml";
  const config: Config = yaml.safeLoad(await readFileAsync(configPath, "utf8"));
  return config;
}
