import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
import { ChainRule, WithDetails } from "../types";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("chain executed in order", (t) => {
  const { rootState, createRules } = t.context;
  const ruleDefs: WithDetails<ChainRule>[] = [
    {
      key: t.context.output,
      type: "chain",
      source: "root/chain/input",
      rules: [
        {
          type: "pick",
          field: "temperature",
          source: "", // need to figure out how to exclude this in types
        },
        {
          type: "number",
          source: "",
        },
        {
          type: "calculation",
          op: ">",
          value: 10,
          source: "", // need to figure out how to exclude this in types
        },
      ],
    },
  ];
  const rules = createRules(ruleDefs);

  rootState.setValue("root/chain/input", { temperature: "5" });
  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/chain/input", { temperature: "20" });
  t.is(rules.getState()[t.context.output], true);
});
