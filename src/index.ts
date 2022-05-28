import { Config } from "./config";
import { Events } from "./events";
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
  state.on("change", ({ value, key }) => {
    const rule = rules[key];
    console.log("State Updated:", key, "->", value);

    if (rule.mqtt === false) return;

    mqtt.send(
      key,
      value,
      typeof rule.mqtt === "object" ? rule.mqtt : undefined
    );
  });

  const events = new Events(state);

  const rules: Record<string, Rule> = {};

  for (const ruleDetails of config.rules) {
    const rule = new Rule(ruleDetails);
    rules[rule.key] = rule;
    const handler = rule.getHandler();
    for (const e of rule.events) {
      events.subscribe(e, handler);
    }
  }

  await mqtt.start(events);
}
