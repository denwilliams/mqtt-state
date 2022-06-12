import { Config } from "./config";
import { createService } from "./service";
import { MockMqtt } from "./mqtt";

export function createTestService(
  options: Pick<Config, "metrics" | "rules" | "templates">,
  initialState?: Record<string, any>
) {
  const results = createService(
    {
      mqtt: {
        uri: "mock",
        subscriptions: [],
        raw: [],
      },
      metrics: options.metrics,
      templates: options.templates,
      rules: options.rules,
    },
    undefined,
    initialState
  );
  return {
    ...results,
    mqtt: results.mqtt as MockMqtt,
  };
}
