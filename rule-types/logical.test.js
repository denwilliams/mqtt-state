const test = require("ava");
const { beforeEach } = require("./_test-helper");

test.beforeEach(beforeEach);

test("AND", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/logical/and",
      type: "filter",
      source: "root/input/filter",
      regexp: "test\\d+"
    }
  ]);

  rootState.setValue("root/input/filter", "test123");
  rootState.setValue("root/input/filter", "stuff123");

  t.is(
    rules.getState()["output/logical/and"],
    "test123",
    "second value should have been filtered out"
  );
});
