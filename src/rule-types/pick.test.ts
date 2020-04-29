import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("'pick's the field on the object", (t) => {
  const { rootState, createRules } = t.context as any;
  const rules = createRules([
    {
      key: "output/pick",
      type: "pick",
      source: "root/input/pick",
      field: "pickMe",
    },
  ]);

  rootState.setValue("root/input/pick", { a: 1 });
  t.is(rules.getState()["output/pick"], undefined);

  rootState.setValue("root/input/pick", { a: 1, pickMe: 2 });
  t.is(rules.getState()["output/pick"], 2);
});
