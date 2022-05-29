import test from "ava";
import { createTestService } from "./_test-helper";

test("returns an object containing all values", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `
        set({
          one: state.get("input/one"),
          two: state.get("input/two"),
        });
        `,
        subscribe: ["input/one", "input/two"],
      },
    ],
  });

  await service.start();
  service.mqtt.mockIncoming("input/one", "111");
  t.deepEqual(service.activeState.get("output"), { one: 111, two: undefined });
  service.mqtt.mockIncoming("input/two", '"222"');
  t.deepEqual(service.activeState.get("output"), { one: 111, two: "222" });
  await service.stop();

  t.is(service.mqtt.sent.length, 2);
});
