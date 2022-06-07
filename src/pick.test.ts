import test from "ava";
import { createTestService } from "./_test-helper";

test("'pick's the field on the object", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        // Note: if using node 14+ you could just do set(event.value?.pickMe)
        source: "set(event.value && event.value.pickMe);",
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", { pickMe: "hello", other: true });
  t.is(service.activeState.get("output"), "hello");

  service.events.publish("input", { other: true });
  t.is(service.activeState.get("output"), undefined);
});
