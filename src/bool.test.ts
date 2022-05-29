import test from "ava";
import { createTestService } from "./_test-helper";

test("is the truthy version of its source", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output/boolean",
        source: "set(Boolean(event.value));",
        subscribe: "input/boolean",
      },
    ],
  });

  service.events.publish("input/boolean", 123);
  t.is(service.activeState.get("output/boolean"), true);

  service.events.publish("input/boolean", "test");
  t.is(service.activeState.get("output/boolean"), true);

  service.events.publish("input/boolean", 0);
  t.is(service.activeState.get("output/boolean"), false);

  service.events.publish("input/boolean", "");
  t.is(service.activeState.get("output/boolean"), false);
});
