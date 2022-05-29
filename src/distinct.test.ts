import test from "ava";
import { createTestService } from "./_test-helper";

test("does not emit unless the value changes", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output/boolean",
        source: "set(Boolean(event.value));",
        subscribe: "input/boolean",
        distinct: true,
      },
    ],
  });

  await service.start();
  service.events.publish("input/boolean", 123);
  t.is(service.activeState.get("output/boolean"), true);

  service.events.publish("input/boolean", "test");
  t.is(service.activeState.get("output/boolean"), true);

  service.events.publish("input/boolean", 0);
  t.is(service.activeState.get("output/boolean"), false);
  await service.stop();

  t.is(service.mqtt.sent.length, 2);
});
