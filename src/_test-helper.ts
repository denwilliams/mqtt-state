import { Config } from "./config";
import { createService } from "./service";
import { MockMqtt } from "./mqtt";

export function createTestService(options: Pick<Config, "metrics" | "rules">) {
  const results = createService({
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
