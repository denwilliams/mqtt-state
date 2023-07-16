import test from "ava";
import { createTestService } from "./_test-helper";

test.serial("throttle requests to the defined ms value", async (t) => {
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

  let resolveLastInput: () => void;
  let pLastInput = new Promise<void>((resolve) => {
    resolveLastInput = resolve;
  });
  service.events.publish("input", 1);
  t.is(service.activeState.get("output"), 1, "First event should be immediate");

  setImmediate(async () => {
    const MAX = 100;
    for (let i = 1; i < MAX; i++) {
      service.events.publish("input", i + 1);
      if (i === MAX - 1) {
        resolveLastInput();
      }
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    await service.stop();
  });

  await pLastInput;
  await new Promise((resolve) => setTimeout(resolve, 30));

  t.is(
    service.activeState.get("output"),
    100,
    "Last event should always be emitted after throttle window"
  );

  const first = service.mqtt.sent[0];
  const last = service.mqtt.sent[service.mqtt.sent.length - 1];

  t.deepEqual(first, {
    topic: "output",
    message: 1,
    options: undefined,
  });
  t.deepEqual(last, {
    topic: "output",
    message: 100,
    options: undefined,
  });

  t.true(
    service.mqtt.sent.length > 15,
    "Should only have some throttled events in the middle"
  );
  t.true(
    service.mqtt.sent.length < 70,
    "Should not have all the middle events"
  );
});
