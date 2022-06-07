import test from "ava";
import { createTestService } from "./_test-helper";

test("can use a template instead of source", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        subscribe: "input",
        template: "times10",
      },
    ],
    templates: [{ id: "times10", source: "set(event.value * 10)" }],
  });

  service.events.publish("input", 123);
  t.is(service.activeState.get("output"), 1230);
});

test("can pass in params with a template", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        subscribe: "input",
        template: "multiply",
        params: {
          multiplier: 5,
        },
      },
    ],
    templates: [
      { id: "multiply", source: "set(event.value * params.multiplier)" },
    ],
  });

  service.events.publish("input", 123);
  t.is(service.activeState.get("output"), 615);
});
