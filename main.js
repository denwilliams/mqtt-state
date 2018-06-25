const yaml = require('js-yaml');
const fs = require('fs');

const configPath = process.env.CONFIG_PATH || __dirname + '/config.yml';
const config = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));

const filePath = config.data.file || join(__dirname, 'state.json');
const fileState = require('./file-state').create(filePath);
const rootState = require('./root-state').create(fileState.load());

rootState.subscribe(() => {
  fileState.save(rootState.getState());
});

const reactive = require('./reactive').create(rootState);
const mqtt = require('./mqtt').create(rootState, config.mqtt.uri, config.mqtt.subscriptions);

var rulesList = config.rules;
const rules = require('./rules').create(rulesList, reactive, mqtt);
const http = require('./http').create(rootState, rules, config.http.port);
