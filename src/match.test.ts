import test from "ava";
import { createTestService } from "./_test-helper";

test("returns true if matches regexp, false if not", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `
        const match = /test\\d+/;
        set(match.test(event.value));
        `,
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", "test123");
  t.is(
    service.activeState.get("output"),
    true,
    "second value should have been filtered out"
  );

  service.events.publish("input", "stuff123");
  t.is(
    service.activeState.get("output"),
    false,
    "second value should have been filtered out"
  );
});
