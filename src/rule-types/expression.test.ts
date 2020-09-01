import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("can have an initial value", (t) => {
  const { createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "expression",
      source: "root/input/expression",
      expression: "1",
    },
  ]);

  t.is(rules.getState()[t.context.output], 1);
});

test("returns the result of the expression", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "expression",
      source: "root/input/expression",
      expression: "value && value.startsWith('foo')",
    },
  ]);

  rootState.setValue("root/input/expression", "foo");
  t.is(rules.getState()[t.context.output], true);
  rootState.setValue("root/input/expression", "foobar");
  t.is(rules.getState()[t.context.output], true);
  rootState.setValue("root/input/expression", "barfoo");
  t.is(rules.getState()[t.context.output], false);
});

test("can return strings too", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "expression",
      source: "root/input/expression/str",
      expression: "value + 'bar'",
    },
  ]);

  rootState.setValue("root/input/expression/str", "foo");
  t.is(rules.getState()[t.context.output], "foobar");
});

test("can ignore undefined (and initial) values", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "expression",
      source: "root/input/expression",
      expression: "value + 'bar'",
      ignore_undefined: true,
    },
  ]);

  t.is(rules.getState()[t.context.output], undefined);
  rootState.setValue("root/input/expression", undefined);
  t.is(rules.getState()[t.context.output], undefined);
});

test("can ignore null values", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "expression",
      source: "root/input/expression",
      expression: "value + 'bar'",
      ignore_null: true,
    },
  ]);

  rootState.setValue("root/input/expression", null);
  t.is(rules.getState()[t.context.output], null);
});

test("can getValue for other keys too", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "expression",
      source: "root/input/expression",
      expression: `value + getValue('${t.context.output + "/bar"}')`,
      ignore_undefined: true,
    },
    {
      key: t.context.output + "/bar",
      type: "alias",
      source: "root/input/expression/bar",
    },
  ]);

  rootState.setValue("root/input/expression/bar", 0);
  rootState.setValue("root/input/expression", 2);
  t.is(rules.getState()[t.context.output], 2);
  rootState.setValue("root/input/expression/bar", 2);
  // Bar is not a source so it will not trigger an update
  t.is(rules.getState()[t.context.output], 2);
  rootState.setValue("root/input/expression", 3);
  // It should now update with the new value of bar
  t.is(rules.getState()[t.context.output], 5);
});
