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

test.serial("captures child metrics", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `
          set(event.value);
          setChild("child", event.value + 1);
        `,
        subscribe: "input",
        metric: {
          name: "output_metric",
        },
        children: {
          child: {
            metric: {
              name: "output_child_metric",
            },
          },
        },
      },
    ],
  });
  t.is(
    register.metrics(),
    `# HELP output_metric output_metric
# TYPE output_metric gauge
output_metric 0

# HELP output_child_metric output_child_metric
# TYPE output_child_metric gauge
output_child_metric 0
`
  );

  service.events.publish("input", 100);
  t.is(service.activeState.get("output"), 100);

  t.is(
    register.metrics(),
    `# HELP output_metric output_metric
# TYPE output_metric gauge
output_metric 100

# HELP output_child_metric output_child_metric
# TYPE output_child_metric gauge
output_child_metric 101
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
