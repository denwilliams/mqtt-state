import test from "ava";
import { createTestService } from "./_test-helper";

test("filters source using regular expression", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `
        const match = /test\\d+/;
        if (match.test(event.value)) {
          set(event.value);
        }
        `,
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", "test123");
  service.events.publish("input", "stuff123");

  t.is(
    service.activeState.get("output"),
    "test123",
    "second value should have been filtered out"
  );
});

test("filters source using eq", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `
        if (event.value === 1) {
          set(event.value);
        }
        `,
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 1);
  service.events.publish("input", 2);

  t.is(
    service.activeState.get("output"),
    1,
    "second value should have been filtered out"
  );
});
