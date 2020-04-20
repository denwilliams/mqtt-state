import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("counts how many times the source emits (changes)", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    { key: "output/counter", type: "counter", source: "root/input/counter" },
  ]);

  t.is(rules.getState()["output/counter"], 1);

  rootState.setValue("root/input/counter", 123);
  rootState.setValue("root/input/counter", 456);

  t.is(rules.getState()["output/counter"], 3);
});
