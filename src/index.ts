import { Config } from "./config";
import { Events } from "./events";
import { HttpServer } from "./http";
import { Metrics } from "./metrics";
import { Mqtt } from "./mqtt";
import { Rule } from "./rule";
import { State } from "./state";

export async function start(config: Config) {
  const state = new State();
  const mqtt = new Mqtt(
    config.mqtt.uri,
    config.mqtt.subscriptions,
    config.mqtt.raw
  );
  const metrics = new Metrics(config.metrics || []);

  state.on("change", ({ value, key }) => {
    const rule = rules[key];
    console.log("State Updated:", key, "->", value);

    if (rule.mqtt !== false) {
      mqtt.send(
        key,
        value,
        typeof rule.mqtt === "object" ? rule.mqtt : undefined
      );
    }

    if (rule.gauge) {
      if (typeof value === "number") rule.gauge(value);
      else if (typeof value === "boolean") rule.gauge(value ? 1 : 0);
    }
  });

  const events = new Events(state);

  const rules: Record<string, Rule> = {};

  for (const ruleDetails of config.rules) {
    const rule = new Rule(ruleDetails, metrics);
    rules[rule.key] = rule;
    const handler = rule.getHandler();
    for (const e of rule.events) {
      events.subscribe(e, handler);
    }
  }

  if (config.http) {
    const http = new HttpServer();
    await http.start(config.http.port);
  }

  await mqtt.start(events);
}
