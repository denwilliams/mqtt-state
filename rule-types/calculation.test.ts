import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test(">", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "calculation",
      source: "root/input",
      op: ">",
      value: 10,
    },
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 1);
  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 11);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input", 10);
  t.is(rules.getState()[t.context.output], false);
});

test(">=", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "calculation",
      source: "root/input",
      op: ">=",
      value: 10,
    },
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 1);
  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 11);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input", 10);
  t.is(rules.getState()[t.context.output], true);
});

test("<", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "calculation",
      source: "root/input",
      op: "<",
      value: 10,
    },
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 1);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input", 11);
  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 10);
  t.is(rules.getState()[t.context.output], false);
});

test("<=", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "calculation",
      source: "root/input",
      op: "<=",
      value: 10,
    },
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 1);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input", 11);
  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 10);
  t.is(rules.getState()[t.context.output], true);
});

test("==", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "calculation",
      source: "root/input",
      op: "==",
      value: 10,
    },
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 1);
  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 11);
  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 10);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input", "10");
  t.is(rules.getState()[t.context.output], true);
});

test("===", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "calculation",
      source: "root/input",
      op: "===",
      value: 10,
    },
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 1);
  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 11);
  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input", 10);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input", "10");
  t.is(rules.getState()[t.context.output], false);
});
