import test from "ava";
import { createTestService } from "./_test-helper";

test("emits each child value separately", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output/base",
        source: `
        switch (event.value) {
          case "one":
            setChild("one", 1);
            break;
          case "two":
            setChild("two", 2);
            break;
          default:
            set(event.value);
            break;
        }
        `,
        subscribe: "input/base",
      },
    ],
  });

  await service.start();
  service.events.publish("input/base", "one");
  service.events.publish("input/base", "two");
  service.events.publish("input/base", "three");
  service.events.publish("input/base", "one");
  service.events.publish("input/base", "four");
  await service.stop();

  t.deepEqual(service.activeState.getAll(), {
    "output/base": "four",
    "output/base/one": 1,
    "output/base/two": 2,
  });

  t.deepEqual(
    service.mqtt.sent.map((s) => s.topic),
    [
      "output/base/one",
      "output/base/two",
      "output/base",
      "output/base/one",
      "output/base",
    ]
  );

  t.deepEqual(
    service.mqtt.sent.map((s) => s.message),
    [1, 2, "three", 1, "four"]
  );
});

test("distinct values are observed at the child level", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output/base",
        source: `
        switch (event.value) {
          case "one":
          case "two":
            setChild("child", event.value);
            break;
          default:
            set(event.value);
            break;
        }
        `,
        subscribe: "input/base",
        distinct: true,
      },
    ],
  });

  await service.start();
  service.events.publish("input/base", "one");
  service.events.publish("input/base", "one");
  service.events.publish("input/base", "two");
  service.events.publish("input/base", "three");
  service.events.publish("input/base", "three");
  service.events.publish("input/base", "four");
  await service.stop();

  t.is(service.mqtt.sent.length, 4);

  t.deepEqual(
    service.mqtt.sent.map((s) => s.topic),
    ["output/base/child", "output/base/child", "output/base", "output/base"]
  );
});
