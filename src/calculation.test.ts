import test from "ava";
import { createTestService } from "./_test-helper";

test(">", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value > 10);",
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 1);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input", 11);
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", 10);
  t.is(service.activeState.get("output"), false);
});

test(">=", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value >= 10);",
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 1);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input", 11);
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", 10);
  t.is(service.activeState.get("output"), true);
});
