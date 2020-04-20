import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("returns false initially", (t) => {
  const { createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "match",
      source: "root/input/match",
      regexp: "yes.",
    },
  ]);

  t.is(rules.getState()[t.context.output], false);
});

test("returns true if matches regexp", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "match",
      source: "root/input/match",
      regexp: "yes.",
    },
  ]);

  rootState.setValue("root/input/match", "yes1");
  t.is(rules.getState()[t.context.output], true);
});

test("returns false if doesn't match regexp", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "match",
      source: "root/input/match",
      regexp: "yes.",
    },
  ]);

  rootState.setValue("root/input/match", "no");
  t.is(rules.getState()[t.context.output], false);
});
