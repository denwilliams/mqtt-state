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

test("can do math functions", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "expression",
      source: "root/input/expression/math",
      expression: "Math.round(value)",
    },
  ]);

  rootState.setValue("root/input/expression/math", 1.1);
  t.is(rules.getState()[t.context.output], 1);
  rootState.setValue("root/input/expression/math", 1.5);
  t.is(rules.getState()[t.context.output], 2);
  rootState.setValue("root/input/expression/math", 1.8);
  t.is(rules.getState()[t.context.output], 2);
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

test("multiple sources", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "expression",
      sources: {
        a: "root/input/expression/1",
        b: "root/input/expression/2",
        c: "root/input/expression/3",
      },
      expression: "name === 'c' ? JSON.stringify(values) : name + value",
      ignore_undefined: true,
    },
  ]);

  rootState.setValue("root/input/expression/1", 2);
  t.is(rules.getState()[t.context.output], "a2");

  rootState.setValue("root/input/expression/2", 3);
  t.is(rules.getState()[t.context.output], "b3");

  rootState.setValue("root/input/expression/1", undefined);
  t.is(rules.getState()[t.context.output], "b3", "should not have changed");

  rootState.setValue("root/input/expression/3", 4);
  t.is(rules.getState()[t.context.output], '{"b":3,"c":4}');
});

test("merging values", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "expression",
      sources: {
        bedroom: "root/input/expression/bedroom",
        living: "root/input/expression/living",
        kitchen: "root/input/expression/kitchen",
      },
      expression: "(Object.values(values)).map(x => x)",
      ignore_undefined: true,
    },
  ]);

  rootState.setValue("root/input/expression/bedroom", 2);
  rootState.setValue("root/input/expression/kitchen", 3);
  rootState.setValue("root/input/expression/living", 5);

  t.deepEqual(rules.getState()[t.context.output], [2, 5, 3]);
});
