import test from "ava";
import { createTestService } from "./_test-helper";

test("returns the result of the expression", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(String(event.value).startsWith('foo'));",
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", "foo");
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", "foobar");
  t.is(service.activeState.get("output"), true);

  service.events.publish("input", "barfo");
  t.is(service.activeState.get("output"), false);
});

test("can do math functions", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(Math.round(event.value));",
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 1.1);
  t.is(service.activeState.get("output"), 1);

  service.events.publish("input", 1.5);
  t.is(service.activeState.get("output"), 2);

  service.events.publish("input", 1.8);
  t.is(service.activeState.get("output"), 2);
});

test("can make strings too", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: "set(event.value + 'bar');",
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", "foo");
  t.is(service.activeState.get("output"), "foobar");
});

test("can ignore undefined and null values", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source:
          "if (event.value !== undefined && event.value !== null) set(event.value + 'bar');",
        subscribe: "input",
      },
    ],
  });

  t.is(service.activeState.get("output"), undefined);

  service.events.publish("input", undefined);
  t.is(service.activeState.get("output"), undefined);
  service.events.publish("input", null);
  t.is(service.activeState.get("output"), undefined);
  service.events.publish("input", "foo");
  t.is(service.activeState.get("output"), "foobar");
  service.events.publish("input", undefined);
  t.is(service.activeState.get("output"), "foobar");
  service.events.publish("input", null);
  t.is(service.activeState.get("output"), "foobar");
});

test("can get other keys too", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "suffix",
        source: "set(event.value);",
        subscribe: "input/suffix",
      },
      {
        key: "output",
        source: "set(event.value + state.get('suffix'));",
        subscribe: "input/concat",
      },
    ],
  });

  service.events.publish("input/concat", "foo");
  t.is(service.activeState.get("output"), "fooundefined");

  service.events.publish("input/suffix", "bar");
  t.is(service.activeState.get("output"), "fooundefined");

  service.events.publish("input/concat", "foo");
  t.is(service.activeState.get("output"), "foobar");
});

test("multiple sources", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `
        if (event.name === 'input1') set(event.value + 'bar');
        if (event.name === 'input2') set(event.value + 'baz');
        `,
        subscribe: ["input1", "input2"],
      },
    ],
  });

  service.events.publish("input1", "foo");
  t.is(service.activeState.get("output"), "foobar");

  service.events.publish("input2", "foo");
  t.is(service.activeState.get("output"), "foobaz");
});
