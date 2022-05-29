import { Config } from "./config";
import { create } from "./index";
import { MockMqtt } from "./mqtt";

export function createTestService(options: Pick<Config, "metrics" | "rules">) {
  const results = create({
    mqtt: {
      uri: "mock",
      subscriptions: [],
      raw: [],
    },
    metrics: options.metrics,
    rules: options.rules,
  });
  return {
    ...results,
    mqtt: results.mqtt as MockMqtt,
  };
}
