import test from "ava";
import { createTestService } from "./_test-helper";

test("toggles on any event", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(!currentValue);",
        subscribe: ["input1", "input2"],
      },
    ],
  });

  service.events.publish("input1", true);
  t.is(service.activeState.get("output"), true);

  service.events.publish("input1", true);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input2", 0);
  t.is(service.activeState.get("output"), true);

  service.events.publish("input2", false);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input1", "");
  t.is(service.activeState.get("output"), true);
});
