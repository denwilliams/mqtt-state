import test from "ava";
import { createTestService } from "./_test-helper";

test("'pick's the field on the object", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value?.pickMe);",
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", { pickMe: "hello", other: true });
  t.is(service.activeState.get("output"), "hello");

  service.events.publish("input", { other: true });
  t.is(service.activeState.get("output"), undefined);
});
