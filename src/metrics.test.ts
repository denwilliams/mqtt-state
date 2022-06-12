import test from "ava";
import { register } from "prom-client";
import { createTestService } from "./_test-helper";

test.beforeEach(() => {
  register.clear();
});

test.serial("captures metrics", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value);",
        subscribe: "input",
        metric: {
          name: "output_metric",
        },
      },
    ],
  });
  t.is(
    register.metrics(),
    `# HELP output_metric output_metric
# TYPE output_metric gauge
output_metric 0
`
  );

  service.events.publish("input", 100);
  t.is(service.activeState.get("output"), 100);

  t.is(
    register.metrics(),
    `# HELP output_metric output_metric
# TYPE output_metric gauge
output_metric 100
`
  );
});

test.serial("initial metric values", (t) => {
  const service = createTestService(
    {
      rules: [
        {
          key: "output",
          source: "set(event.value);",
          subscribe: "input",
          metric: {
            name: "output_metric",
          },
        },
      ],
    },
    { output: 150 }
  );
  t.is(
    register.metrics(),
    `# HELP output_metric output_metric
# TYPE output_metric gauge
output_metric 150
`
  );

  service.events.publish("input", 100);
  t.is(service.activeState.get("output"), 100);

  t.is(
    register.metrics(),
    `# HELP output_metric output_metric
# TYPE output_metric gauge
output_metric 100
`
  );
});
