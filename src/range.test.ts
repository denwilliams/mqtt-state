import test from "ava";
import { createTestService } from "./_test-helper";

test("inside range", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value >= 100 && event.value <= 200);",
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 1);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input", 100);
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", 150);
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", 200);
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", 201);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input", null);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input", "word");
  t.is(service.activeState.get("output"), false);
});

test("outside range", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value < 100 || event.value > 200);",
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 1);
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", 100);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input", 150);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input", 200);
  t.is(service.activeState.get("output"), false);

  service.events.publish("input", 201);
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", null); // null is interpreted as 0
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", "word");
  t.is(service.activeState.get("output"), false);
});
