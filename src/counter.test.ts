import test from "ava";
import { createTestService } from "./_test-helper";

test("counts how many times the source emits (changes)", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "counter",
        source: "set((currentValue || 0) + 1);",
        subscribe: ["input1", "input2"],
      },
    ],
  });

  service.events.publish("input1", 100);
  service.events.publish("input2", 200);
  service.events.publish("input1", 300);

  t.is(service.activeState.get("counter"), 3);
});
