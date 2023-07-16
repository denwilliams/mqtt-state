import test from "ava";
import { register } from "prom-client";
import { createTestService } from "./_test-helper";

test.beforeEach(() => {
  register.clear();
});

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

test("can define metrics ", async (t) => {
  const service = createTestService({
    metrics: [
      {
        name: "output_metric",
        help: "output_metric",
        labelNames: ["label1", "label2"],
      },
    ],
    rules: [
      {
        key: "output",
        subscribe: "input",
        template: { id: "times10", labels: { label1: "a", label2: "b" } },
      },
    ],
    templates: [
      {
        id: "times10",
        source: "set(event.value * 10)",
        distinct: true,
        metric: {
          name: "output_metric",
          labels: ["label1", "label2"],
        },
      },
    ],
  });

  service.events.publish("input", 123);

  t.is(
    register.metrics(),
    `# HELP output_metric output_metric
# TYPE output_metric gauge
output_metric{label1="a",label2="b"} 1230
`
  );
});
