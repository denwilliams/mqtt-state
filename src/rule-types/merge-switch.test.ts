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

test("eq match", (t) => {
  const { createRules, rootState } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "merge-switch",
      cases: [
        {
          value: false,
          source: "root/input/merge-switch-eq/a",
          eq: true,
        },
        {
          value: 2,
          source: "root/input/merge-switch-eq/a",
          eq: 33,
        },
        {
          value: "three",
          source: "root/input/merge-switch-eq/a",
          eq: "str",
        },
        {
          value: "four",
          source: "root/input/merge-switch-eq/b",
          eq: 4444,
        },
      ],
    },
  ]);

  t.is(rules.getState()[t.context.output], null);

  rootState.setValue("root/input/merge-switch-eq/a", true);
  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/merge-switch-eq/a", 33);
  t.is(rules.getState()[t.context.output], 2);
  rootState.setValue("root/input/merge-switch-eq/a", "str");
  t.is(rules.getState()[t.context.output], "three");
  rootState.setValue("root/input/merge-switch-eq/b", 4444);
  // even though null matches, three above still matches and is first
  t.is(rules.getState()[t.context.output], "three");
  rootState.setValue("root/input/merge-switch-eq/a", "no match");
  t.is(rules.getState()[t.context.output], "four");
  rootState.setValue("root/input/merge-switch-eq/b", "defined");
  // Nothing matches anymore. Null output
  t.is(rules.getState()[t.context.output], null);
});
