import test from "ava";
import { createTestService } from "./_test-helper";

test("repeats its source", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value);",
        subscribe: "input",
      },
    ],
  });

  await service.start();
  service.events.publish("input", 123);
  t.is(service.activeState.get("output"), 123);
  await service.stop();

  t.deepEqual(service.mqtt.sent, [
    {
      topic: "output",
      message: 123,
      options: undefined,
    },
  ]);
});

test("can repeat source only on change with distinct", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value);",
        subscribe: "input",
        distinct: true,
      },
    ],
  });

  await service.start();
  service.mqtt.mockIncoming("input", "123");
  service.mqtt.mockIncoming("input", "123");
  service.mqtt.mockIncoming("input", "456");
  t.is(service.activeState.get("output"), 456);
  await service.stop();

  t.deepEqual(service.mqtt.sent, [
    {
      topic: "output",
      message: 123,
      options: undefined,
    },
    {
      topic: "output",
      message: 456,
      options: undefined,
    },
  ]);
});
