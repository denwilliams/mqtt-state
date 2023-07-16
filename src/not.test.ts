import test from "ava";
import { createTestService } from "./_test-helper";

test("not's the truthy input", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output/not",
        source: "set(!event.value);",
        subscribe: "input/not",
      },
    ],
  });

  service.events.publish("input/not", true);
  t.is(service.activeState.get("output/not"), false);

  service.events.publish("input/not", false);
  t.is(service.activeState.get("output/not"), true);

  service.events.publish("input/not", 0);
  t.is(service.activeState.get("output/not"), true);

  service.events.publish("input/not", 1);
  t.is(service.activeState.get("output/not"), false);

  service.events.publish("input/not", "");
  t.is(service.activeState.get("output/not"), true);

  service.events.publish("input/not", "X");
  t.is(service.activeState.get("output/not"), false);
});
