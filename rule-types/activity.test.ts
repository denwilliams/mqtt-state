import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test.skip("activity single source", (t) => {
  const { rootState } = t.context;
  const rules = t.context.createRules([
    {
      key: "output/activity/a",
      type: "activity",
      source: "root/input/alias",
    },
    {
      key: "output/activity/b",
      type: "activity",
      source: "root/input/alias",
    },
  ]);
  rootState.setValue("root/input/alias", 123);

  t.is(rootState.getState()["root/input/alias"], 123);
  t.is(rules.getState()["output/alias"], 123);
});

test.skip("activity multiple sources", (t) => {
  const { rootState } = t.context;
  const rules = t.context.createRules([
    {
      key: "output/activity/a",
      type: "activity",
      source: "root/input/alias",
    },
    {
      key: "output/activity/b",
      type: "activity",
      source: "root/input/alias",
    },
  ]);
  rootState.setValue("root/input/alias", 123);

  t.is(rootState.getState()["root/input/alias"], 123);
  t.is(rules.getState()["output/alias"], 123);
});

test.skip("activity delay", (t) => {
  const { rootState } = t.context;
  const rules = t.context.createRules([
    {
      key: "output/activity/a",
      type: "activity",
      source: "root/input/alias",
    },
    {
      key: "output/activity/b",
      type: "activity",
      source: "root/input/alias",
    },
  ]);
  rootState.setValue("root/input/alias", 123);

  t.is(rootState.getState()["root/input/alias"], 123);
  t.is(rules.getState()["output/alias"], 123);
});
