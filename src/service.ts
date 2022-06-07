import { ActiveState } from "./active-state";
import { Config } from "./config";
import { Events } from "./events";
import { HttpServer } from "./http";
import { Metrics } from "./metrics";
import { MockMqtt, Mqtt } from "./mqtt";
import { Rule } from "./rule";
import { ChangeEvent, RuleState } from "./rule-state";
import { baseTemplates, Template } from "./template";
import { Ticker } from "./ticker";

export function createService(
  config: Config,
  saveState?: (state: Record<string, any>) => Promise<void>,
  initialState?: Record<string, any>
) {
  const activeState = new ActiveState(initialState);
  const events = new Events(activeState);
  const ticker = new Ticker(events);
  const mqtt =
    config.mqtt.uri === "mock"
      ? new MockMqtt(config.mqtt.raw, activeState)
      : new Mqtt(
          config.mqtt.uri,
          config.mqtt.subscriptions,
          config.mqtt.raw,
          activeState
        );
  const http = config.http
    ? new HttpServer(activeState, config.http.port)
    : undefined;
  const metrics = new Metrics(config.metrics || []);
  const ruleState = new RuleState(activeState);

  const logRules = config.log?.rules;
  const logChanges = config.log?.changes;

  ruleState.on(
    "change",
    ({ key, value, prevValue, rule }: ChangeEvent<any>) => {
      if (logChanges) {
        console.info(
          `${key} ${
            value === prevValue ? "updated" : "changed"
          }: ${prevValue} -> ${value}`
        );
      }

      events.publish(key, value);

      if (rule?.mqtt !== false) {
        mqtt.send(
          key,
          value,
          typeof rule?.mqtt === "object" ? rule.mqtt : undefined
        );
      }

      // NOTE: gauges won't work well with child values
      if (rule?.gauge) {
        if (typeof value === "number") rule.gauge(value);
        else if (typeof value === "boolean") rule.gauge(value ? 1 : 0);
      }
    }
  );

  const templates = (config.templates || []).reduce<Record<string, Template>>(
    (obj, t) => {
      obj[t.id] = new Template(t);
      return obj;
    },
    { ...baseTemplates }
  );

  for (const ruleDetails of config.rules) {
    const rule = new Rule(
      ruleDetails,
      metrics,
      ruleState,
      ruleDetails.template ? templates[ruleDetails.template] : undefined
    );
    const handler = rule.getHandler();
    for (const e of rule.events) {
      events.subscribe(e, handler);
    }
    if (logRules) {
      console.info(`Loaded rule="${rule.key}" events="${rule.events}"`);
    }
  }

  let interval: NodeJS.Timeout | undefined;

  return {
    async start() {
      if (http) await http.start();
      await mqtt.start(events);
      await ticker.start();

      if (!interval && saveState) {
        interval = setInterval(async () => {
          await saveState(activeState.getAll());
        }, config?.data?.saveInterval ?? 60000);
      }
    },
    async stop() {
      if (interval) clearInterval(interval);
      interval = undefined;

      await mqtt.stop();
      await ticker.stop();
      if (http) await http.stop();
      if (saveState) await saveState(activeState.getAll());
    },
    activeState,
    ruleState,
    mqtt,
    http,
    events,
  };
}
