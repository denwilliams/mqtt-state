import test from "ava";
import { createTestService } from "./_test-helper";

test("debounce requests to the defined ms value", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `set(event.value);`,
        subscribe: "input",
        debounce: 50,
      },
    ],
  });

  await service.start();
  setImmediate(async () => {
    for (let i = 0; i < 12; i++) {
      service.events.publish("input", i + 1);
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    await service.stop();
  });

  t.is(
    service.activeState.get("output"),
    undefined,
    "Should be no leading event with debounce"
  );

  await new Promise((resolve) => setTimeout(resolve, 200));

  t.is(service.activeState.get("output"), 12);

  t.deepEqual(
    service.mqtt.sent,
    [
      {
        topic: "output",
        message: 12,
        options: undefined,
      },
    ],
    "Should have skipped everything but last due to debounce"
  );
});
