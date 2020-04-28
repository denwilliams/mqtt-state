import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("repeats its source", (t) => {
  const { rootState } = t.context;
  const rules = t.context.createRules([
    { key: "output/alias", type: "alias", source: "root/input/alias" },
  ]);
  rootState.setValue("root/input/alias", 123);

  t.is(rootState.getState()["root/input/alias"], 123);
  t.is(rules.getState()["output/alias"], 123);
});
