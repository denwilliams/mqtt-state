const test = require("ava");
const { beforeEach } = require("./_test-helper");

test.beforeEach(beforeEach);

test("'pick's the field on the object", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/pick",
      type: "pick",
      source: "root/input/pick",
      field: "pickMe"
    }
  ]);

  rootState.setValue("root/input/pick", { a: 1 });
  t.is(rules.getState()["output/pick"], undefined);

  rootState.setValue("root/input/pick", { a: 1, pickMe: 2 });
  t.is(rules.getState()["output/pick"], 2);
});
