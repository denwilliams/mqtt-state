import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("returns value of first source matching regexp", (t) => {
  const { createRules, rootState } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "merge-switch",
      cases: [
        {
          value: "one",
          source: "root/input/merge-switch/a",
          regexp: "yes.",
        },
        {
          value: "two",
          source: "root/input/merge-switch/a",
          regexp: "alt.",
        },
        {
          value: "three",
          source: "root/input/merge-switch/a",
          regexp: "yes.",
        },
        {
          value: "four",
          source: "root/input/merge-switch/b",
          regexp: "yes.",
        },
      ],
    },
  ]);

  t.is(rules.getState()[t.context.output], null);

  rootState.setValue("root/input/merge-switch/a", "yes1");
  t.is(rules.getState()[t.context.output], "one");
  rootState.setValue("root/input/merge-switch/a", "alt1");
  t.is(rules.getState()[t.context.output], "two");
  rootState.setValue("root/input/merge-switch/b", "yes1");
  t.is(rules.getState()[t.context.output], "two");
  rootState.setValue("root/input/merge-switch/a", "no");
  t.is(rules.getState()[t.context.output], "four");
});
