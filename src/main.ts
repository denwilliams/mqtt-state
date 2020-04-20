import yaml from "js-yaml";
import fs from "fs";
import { join } from "path";
import { create as createFileState } from "./file-state";
import { create as createRootState } from "./root-state";
import { Mqtt } from "./mqtt";
import { create as createReactive } from "./reactive";
import { create as createMetrics } from "./metrics";
import { create as createRules } from "./rules";
import { create as createHttp } from "./http";
import { create as createTicker } from "./ticker";
import { RuleDetails, Config } from "./types";

const configPath = process.env.CONFIG_PATH || __dirname + "/config.yml";
const config: Config = yaml.safeLoad(fs.readFileSync(configPath, "utf8"));

const filePath = config.data.file || join(__dirname, "state.json");
const fileState = createFileState(filePath);
const rootState = createRootState(fileState.load());

rootState.subscribe(() => {
  fileState.save(rootState.getState());
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
  const imported = yaml.safeLoad(fs.readFileSync(rule.import, "utf8"));
  rulesList = rulesList.concat(imported);
}

const metrics = createMetrics(config.metrics);
const rules = createRules(rulesList, reactive, mqtt, metrics);
const http = createHttp(rootState, rules, config.http.port);
const ticker = createTicker(rootState, reactive);

mqtt
  .start()
  .then(() => rules.start())
  .then(() => http.start())
  .then(() => ticker.start());
