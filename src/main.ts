#!/usr/bin/env node
import yaml from "js-yaml";
import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";

import { create as createFileState } from "./file-state";
import { create as createRedisState } from "./redis-state";
import { create as createRootState } from "./root-state";
import { Mqtt } from "./mqtt";
import { create as createReactive } from "./reactive";
import { create as createMetrics } from "./metrics";
import { Rules } from "./rules";
import { create as createHttp } from "./http";
import { create as createTicker } from "./ticker";
import { RuleDetails, Config } from "./types";
import { loadConfig } from "./config";

const readFileAsync = promisify(readFile);

function getPersistence(config: { data: { redis?: string; file?: string } }) {
  if (config.data.redis) {
    return createRedisState(config.data.redis);
  }
  const filePath = config.data.file || join(__dirname, "state.json");
  return createFileState(filePath);
}

async function main() {
  const config: Config = await loadConfig();

  const persistence = getPersistence(config);
  const rootState = createRootState(await persistence.load());

  rootState.subscribe(() => {
    persistence.save(rootState.getState());
  });

  const reactive = createReactive(rootState);
  const mqtt = new Mqtt(
    rootState,
    config.mqtt.uri,
    config.mqtt.subscriptions || [],
    config.mqtt.raw || []
  );

  let rulesList: RuleDetails[] = [];
  for (const rule of config.rules) {
    if (rule.import === undefined) {
      rulesList.push(rule);
      continue;
    }
    const imported = yaml.safeLoad(await readFileAsync(rule.import, "utf8"));
    rulesList = rulesList.concat(imported);
  }

  const metrics = createMetrics(config.metrics);
  const rules = new Rules(rulesList, reactive, mqtt, rootState, metrics);
  const http = createHttp(rootState, rules, config.http.port);
  const ticker = createTicker(rootState, reactive);

  await mqtt
    .start()
    .then(() => rules.start())
    .then(() => http.start())
    .then(() => ticker.start());
}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
