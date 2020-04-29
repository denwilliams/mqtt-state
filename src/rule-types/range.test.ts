import anyTest, { TestInterface } from "ava";
import { beforeEach, TestContext } from "./_test-helper";
const test = anyTest as TestInterface<TestContext>;

test.beforeEach(beforeEach);

test("inside range", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/range/inside",
      type: "range",
      source: "root/input/range/inside",
      values: [100, 200],
    },
  ]);

  rootState.setValue("root/input/range/inside", 1);
  t.is(rules.getState()["output/range/inside"], false);

  rootState.setValue("root/input/range/inside", 99);
  t.is(rules.getState()["output/range/inside"], false);

  rootState.setValue("root/input/range/inside", 100);
  t.is(rules.getState()["output/range/inside"], true);

  rootState.setValue("root/input/range/inside", 101);
  t.is(rules.getState()["output/range/inside"], true);

  rootState.setValue("root/input/range/inside", 199);
  t.is(rules.getState()["output/range/inside"], true);

  rootState.setValue("root/input/range/inside", 200);
  t.is(rules.getState()["output/range/inside"], true);

  rootState.setValue("root/input/range/inside", 201);
  t.is(rules.getState()["output/range/inside"], false);

  rootState.setValue("root/input/range/inside", 999);
  t.is(rules.getState()["output/range/inside"], false);
});

test("outside range", (t) => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/range/outside",
      type: "range",
      source: "root/input/range/outside",
      values: [100, 200],
      outside: true,
    },
  ]);

  rootState.setValue("root/input/range/outside", 1);
  t.is(rules.getState()["output/range/outside"], true);

  rootState.setValue("root/input/range/outside", 99);
  t.is(rules.getState()["output/range/outside"], true);

  rootState.setValue("root/input/range/outside", 100);
  t.is(rules.getState()["output/range/outside"], false);

  rootState.setValue("root/input/range/outside", 101);
  t.is(rules.getState()["output/range/outside"], false);

  rootState.setValue("root/input/range/outside", 199);
  t.is(rules.getState()["output/range/outside"], false);

  rootState.setValue("root/input/range/outside", 200);
  t.is(rules.getState()["output/range/outside"], false);

  rootState.setValue("root/input/range/outside", 201);
  t.is(rules.getState()["output/range/outside"], true);

  rootState.setValue("root/input/range/outside", 999);
  t.is(rules.getState()["output/range/outside"], true);
});
