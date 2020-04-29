import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("is the truthy version of its source", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    { key: "output/boolean", type: "bool", source: "root/input/boolean" },
  ]);

  rootState.setValue("root/input/boolean", 123);
  t.is(rules.getState()["output/boolean"], true);

  rootState.setValue("root/input/boolean", "test");
  t.is(rules.getState()["output/boolean"], true);

  rootState.setValue("root/input/boolean", 0);
  t.is(rules.getState()["output/boolean"], false);

  rootState.setValue("root/input/boolean", "");
  t.is(rules.getState()["output/boolean"], false);
});

test("does not emit unless the value changes", async (t) => {
  const { rootState, mockMqtt, createRules } = t.context;

  const rules = createRules([
    { key: t.context.output, type: "bool", source: "root/input/boolean" },
  ]);

  await rules.start();
  rootState.setValue("root/input/boolean", 123);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input/boolean", "test");
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input/boolean", 0);
  t.is(rules.getState()[t.context.output], false);
  await rules.stop();

  t.is(mockMqtt.count, 2);
});
