import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("returns the boolean value of source", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/onoffauto",
      type: "onoffauto",
      source: "root/input/onoffauto/switch",
      auto: "root/input/onoffauto/auto",
    },
  ]);

  rootState.setValue("root/input/onoffauto/auto", false);
  rootState.setValue("root/input/onoffauto/switch", true);
  t.is(rules.getState()["output/onoffauto"], true);

  rootState.setValue("root/input/onoffauto/auto", true);
  rootState.setValue("root/input/onoffauto/switch", false);
  t.is(rules.getState()["output/onoffauto"], false);
});

test("returns the auto value if source is null", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/onoffauto/auto",
      type: "onoffauto",
      source: "root/input/onoffauto/switch",
      auto: "root/input/onoffauto/auto",
    },
  ]);

  rootState.setValue("root/input/onoffauto/auto", true);
  rootState.setValue("root/input/onoffauto/switch", null);
  t.is(rules.getState()["output/onoffauto/auto"], true);

  rootState.setValue("root/input/onoffauto/auto", false);
  t.is(rules.getState()["output/onoffauto/auto"], false);
});
