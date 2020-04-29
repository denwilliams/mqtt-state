import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("'not's the truthy input", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    { key: "output/not", type: "not", source: "root/input/not" },
  ]);

  t.is(rules.getState()["output/not"], true);

  rootState.setValue("root/input/not", true);
  t.is(rules.getState()["output/not"], false);

  rootState.setValue("root/input/not", false);
  t.is(rules.getState()["output/not"], true);
});
