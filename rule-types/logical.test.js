const test = require("ava");
const { beforeEach } = require("./_test-helper");

test.beforeEach(beforeEach);

test("AND", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/logical/and",
      type: "logical",
      sources: ["root/input/logical/and/a", "root/input/logical/and/b"],
      op: "AND"
    }
  ]);

  t.is(rules.getState()["output/logical/and"], false);

  rootState.setValue("root/input/logical/and/a", true);
  t.is(rules.getState()["output/logical/and"], false);

  rootState.setValue("root/input/logical/and/b", true);
  t.is(rules.getState()["output/logical/and"], true);

  rootState.setValue("root/input/logical/and/a", false);
  t.is(rules.getState()["output/logical/and"], false);

  rootState.setValue("root/input/logical/and/b", false);
  t.is(rules.getState()["output/logical/and"], false);
});

test("OR", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/logical/or",
      type: "logical",
      sources: ["root/input/logical/or/a", "root/input/logical/or/b"],
      op: "OR"
    }
  ]);

  t.is(rules.getState()["output/logical/or"], false);

  rootState.setValue("root/input/logical/or/a", true);
  t.is(rules.getState()["output/logical/or"], true);

  rootState.setValue("root/input/logical/or/b", true);
  t.is(rules.getState()["output/logical/or"], true);

  rootState.setValue("root/input/logical/or/a", false);
  t.is(rules.getState()["output/logical/or"], true);

  rootState.setValue("root/input/logical/or/b", false);
  t.is(rules.getState()["output/logical/or"], false);
});
