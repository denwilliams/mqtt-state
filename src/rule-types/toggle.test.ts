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

  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/toggle", 1);
  t.is(rules.getState()[t.context.output], true);
  rootState.setValue("root/input/toggle", 2);
  t.is(rules.getState()[t.context.output], false);
});

test("toggles from external state", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "toggle",
      source: "root/input/toggle_external",
      toggle_source: "root/input/toggle_external_source",
    },
  ]);

  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/toggle_external", 1);
  t.is(rules.getState()[t.context.output], true);
  rootState.setValue("root/input/toggle_external", 2);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input/toggle_external_source", true);
  rootState.setValue("root/input/toggle_external", 3);
  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/toggle_external", 4);
  t.is(rules.getState()[t.context.output], false);
});

test("set_state forces output", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "toggle",
      source: "root/input/toggle2",
      set_source: "root/input/toggle2_set",
    },
  ]);

  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/toggle2_set", true);
  t.is(rules.getState()[t.context.output], true);
  rootState.setValue("root/input/toggle2_set", true);
  t.is(rules.getState()[t.context.output], true);
  rootState.setValue("root/input/toggle2_set", false);
  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/toggle2", 1);
  t.is(rules.getState()[t.context.output], true);
});
