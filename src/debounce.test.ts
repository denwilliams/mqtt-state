import test from "ava";
import { createTestService } from "./_test-helper";

test.serial("debounce requests to the defined ms value", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output/debounce",
        source: `set(event.value);`,
        subscribe: "input/debounce",
        debounce: 50,
      },
    ],
  });

  await service.start();
  let resolveLastInput: () => void;
  let pLastInput = new Promise<void>((resolve) => {
    resolveLastInput = resolve;
  });
  setImmediate(async () => {
    const MAX = 12;
    for (let i = 0; i < MAX; i++) {
      service.events.publish("input/debounce", i + 1);
      if (i === MAX - 1) {
        resolveLastInput();
      }
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    await service.stop();
  });

  t.is(
    service.activeState.get("output/debounce"),
    undefined,
    "Should be no leading event with debounce"
  );

  await pLastInput;
  t.is(service.activeState.get("output/debounce"), undefined);

  await new Promise((resolve) => setTimeout(resolve, 50));

  t.is(service.activeState.get("output/debounce"), 12);

  t.deepEqual(
    service.mqtt.sent,
    [
      {
        topic: "output/debounce",
        message: 12,
        options: undefined,
      },
    ],
    "Should have skipped everything but last due to debounce"
  );
});
