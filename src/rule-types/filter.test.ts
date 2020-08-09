import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("filters source using regular expression", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/filter",
      type: "filter",
      source: "root/input/filter",
      regexp: "test\\d+",
    },
  ]);

  rootState.setValue("root/input/filter", "test123");
  rootState.setValue("root/input/filter", "stuff123");

  t.is(
    rules.getState()["output/filter"],
    "test123",
    "second value should have been filtered out"
  );
});

test("filters source using eq", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/filter_eq",
      type: "filter",
      source: "root/input/filter",
      eq: 1,
    },
  ]);

  rootState.setValue("root/input/filter", 1);
  rootState.setValue("root/input/filter", 0);

  t.is(
    rules.getState()["output/filter_eq"],
    1,
    "second value should have been filtered out"
  );
});
