import test from "ava";
import { createTestService } from "./_test-helper";

test("throttle requests to the defined ms value", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value);",
        subscribe: "input",
        throttle: 30,
      },
    ],
  });

  await service.start();
  service.events.publish("input", 1);
  t.is(service.activeState.get("output"), 1, "First event should be immediate");

  service.events.publish("input", 2);
  await new Promise((resolve) => setTimeout(resolve, 10));
  service.events.publish("input", 3);
  await new Promise((resolve) => setTimeout(resolve, 10));
  service.events.publish("input", 4);
  await new Promise((resolve) => setTimeout(resolve, 10));
  service.events.publish("input", 5);

  await new Promise((resolve) => setTimeout(resolve, 20));

  t.is(service.activeState.get("output"), 5);

  t.deepEqual(
    service.mqtt.sent,
    [
      {
        topic: "output",
        message: 1,
        options: undefined,
      },
      {
        topic: "output",
        message: 4,
        options: undefined,
      },
      {
        topic: "output",
        message: 5,
        options: undefined,
      },
    ],
    "Should only have first, last, and one in the middle"
  );

  await service.stop();
});
