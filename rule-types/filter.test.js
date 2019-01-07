const test = require("ava");
const { beforeEach } = require("./_test-helper");

test.beforeEach(beforeEach);

test("filters source using regular expression", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: "output/filter",
      type: "filter",
      source: "root/input/filter",
      regexp: "test\\d+"
    }
  ]);

  rootState.setValue("root/input/filter", "test123");
  rootState.setValue("root/input/filter", "stuff123");

  t.is(
    rules.getState()["output/filter"],
    "test123",
    "second value should have been filtered out"
  );
});
