import test from "ava";
import { createTestService } from "./_test-helper";

test("does not emit unless the value changes", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output/boolean",
        source: "set(Boolean(event.value));",
        subscribe: "input/boolean",
        distinct: true,
      },
    ],
  });

  await service.start();
  service.events.publish("input/boolean", 123);
  t.is(service.activeState.get("output/boolean"), true);

  service.events.publish("input/boolean", "test");
  t.is(service.activeState.get("output/boolean"), true);

  service.events.publish("input/boolean", 0);
  t.is(service.activeState.get("output/boolean"), false);
  await service.stop();

  t.is(service.mqtt.sent.length, 2);
});

test("children have different configuration", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output_with_children",
        source: `
          set(event.value);
          setChild("child1", event.value);
          setChild("child2", event.value);
        `,
        subscribe: "input_with_children",
        distinct: true,
        children: {
          child1: {
            distinct: false,
          },
          child2: {
            distinct: true,
          },
        },
      },
    ],
  });

  await service.start();
  service.events.publish("input_with_children", 123);
  t.is(service.mqtt.sent.length, 3);
  service.events.publish("input_with_children", 456);
  t.is(service.mqtt.sent.length, 6);
  service.events.publish("input_with_children", 456);
  t.is(service.activeState.get("output_with_children"), 456);
  await service.stop();
  t.is(service.mqtt.sent.length, 7);
});
