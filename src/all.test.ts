import test from "ava";
import { createTestService } from "./_test-helper";

test("outputs values from any subscription", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value);",
        subscribe: ["input/one", "input/two"],
      },
    ],
  });

  await service.start();
  service.events.publish("input/one", 111);
  t.is(service.activeState.get("output"), 111);
  service.events.publish("input/two", "222");
  t.is(service.activeState.get("output"), "222");
  await service.stop();

  t.is(service.mqtt.sent.length, 2);
});

test("is the last value of any suscription", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output/a",
        source: "set(event.value);",
        subscribe: ["input/one", "input/two"],
      },
      {
        key: "output/b",
        source: "set(event.value);",
        subscribe: ["input/one"],
      },
    ],
  });

  service.events.publish("input/one", 123);
  service.events.publish("input/two", 456);

  t.is(service.activeState.get("output/a"), 456);
  t.is(service.activeState.get("output/b"), 123);
});
