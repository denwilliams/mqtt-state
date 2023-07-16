import test from "ava";
import { createTestService } from "./_test-helper";

test("returns value of first source matching regexp", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `
        if (state.get("input/one") === "alert") {
          set(99);
        } else if (state.get("input/one")) {
          set(1);
        } else if (state.get("input/two")) {
          set(2);
        } else {
          set(0);
        }
        `,
        subscribe: ["input/one", "input/two"],
      },
    ],
  });

  await service.start();

  service.mqtt.mockIncoming("input/one", "false");
  t.is(service.activeState.get("output"), 0);

  service.mqtt.mockIncoming("input/two", "false");
  t.is(service.activeState.get("output"), 0);

  service.mqtt.mockIncoming("input/two", "true");
  t.is(service.activeState.get("output"), 2);

  service.mqtt.mockIncoming("input/one", "true");
  t.is(service.activeState.get("output"), 1);

  service.mqtt.mockIncoming("input/two", "false");
  t.is(service.activeState.get("output"), 1);

  service.mqtt.mockIncoming("input/one", "false");
  t.is(service.activeState.get("output"), 0);

  service.mqtt.mockIncoming("input/one", '"alert"');
  t.is(service.activeState.get("output"), 99);

  await service.stop();

  t.deepEqual(service.mqtt.sent.length, 7);
});
