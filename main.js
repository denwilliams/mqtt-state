#!/usr/bin/env node
const yaml = require("js-yaml");
const fs = require("fs");
const join = require("path");

const configPath = process.env.CONFIG_PATH || __dirname + "/config.yml";
const config = yaml.safeLoad(fs.readFileSync(configPath, "utf8"));

const filePath = config.data.file || join(__dirname, "state.json");
const fileState = require("./file-state").create(filePath);
const rootState = require("./root-state").create(fileState.load());

rootState.subscribe(() => {
  fileState.save(rootState.getState());
});

const reactive = require("./reactive").create(rootState);
const mqtt = require("./mqtt").create(
  rootState,
  config.mqtt.uri,
  config.mqtt.subscriptions || [],
  config.mqtt.raw || []
);

var rulesList = config.rules;
const rules = require("./rules").create(rulesList, reactive, mqtt);
const http = require("./http").create(rootState, rules, config.http.port);
const ticker = require("./ticker").create(rootState, reactive);

mqtt
  .start()
  .then(() => rules.start())
  .then(() => http.start())
  .then(() => ticker.start());
