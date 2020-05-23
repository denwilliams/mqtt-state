import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("toggles on stream", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "toggle",
      source: "root/input/toggle",
    },
  ]);

  t.is(rules.getState()[t.context.output], true);
  rootState.setValue("root/input/toggle", 1);
  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/toggle", 2);
  t.is(rules.getState()[t.context.output], true);
});

test("toggles from external state", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "toggle",
      source: "root/input/toggle_external",
      toggle_source: "root/input/toggle_source",
    },
  ]);

  rootState.setValue("root/input/toggle_external", 1);
  t.is(rules.getState()[t.context.output], true);
  rootState.setValue("root/input/toggle_external", 2);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input/toggle_source", true);
  rootState.setValue("root/input/toggle_external", 3);
  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/toggle_external", 4);
  t.is(rules.getState()[t.context.output], false);
});