import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
import { ActivityRule, WithDetails } from "../types";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("activity single source starts false, true on event", async (t) => {
  const { rootState } = t.context;
  const ruleDefs: WithDetails<ActivityRule>[] = [
    {
      key: "output/activity/a",
      type: "activity",
      source: "root/input/activity",
      interval: 1000,
    },
  ];
  const rules = t.context.createRules(ruleDefs);
  t.is(rules.getState()["output/activity/a"], false);

  rootState.setValue("root/input/activity", 123);

  t.is(rootState.getState()["root/input/activity"], 123);
  t.is(rules.getState()["output/activity/a"], true);
});

test("activity with reset source, false after reset", async (t) => {
  const { rootState } = t.context;
  const sources: Record<string, string> = {
    input: "root/input/activity/input",
    reset: "root/input/activity/reset",
  };
  const ruleDefs: WithDetails<ActivityRule>[] = [
    {
      key: "output/activity/b",
      type: "activity",
      sources,
      interval: 1000,
    },
  ];
  const rules = t.context.createRules(ruleDefs);
  t.is(rules.getState()["output/activity/b"], false);

  rootState.setValue("root/input/activity/input", 123);
  t.is(rules.getState()["output/activity/b"], true);

  rootState.setValue("root/input/activity/reset", 123);
  t.is(rules.getState()["output/activity/b"], false);
});

test("activity multple sources", async (t) => {
  const { rootState } = t.context;
  const ruleDefs: WithDetails<ActivityRule>[] = [
    {
      key: "output/activity/c",
      type: "activity",
      sources: ["root/input/activity/input1", "root/input/activity/input2"],
      interval: 1000,
    },
  ];
  const rules = t.context.createRules(ruleDefs);
  t.is(rules.getState()["output/activity/c"], false);

  rootState.setValue("root/input/activity/input2", 123);

  t.is(rootState.getState()["root/input/activity/input2"], 123);
  t.is(rules.getState()["output/activity/c"], true);
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
