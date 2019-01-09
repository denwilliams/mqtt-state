const test = require("ava");
const { beforeEach } = require("./_test-helper");

test.beforeEach(beforeEach);

test("returns an object containing all values", t => {
  const { createRules, rootState } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "merge",
      sources: {
        one: "root/input/merge/one",
        two: "root/input/merge/two"
      }
    }
  ]);

  t.deepEqual(rules.getState()[t.context.output], {
    one: undefined,
    two: undefined
  });

  rootState.setValue("root/input/merge/one", "xyz");
  t.deepEqual(rules.getState()[t.context.output], {
    one: "xyz",
    two: undefined
  });

  rootState.setValue("root/input/merge/two", 123);
  t.deepEqual(rules.getState()[t.context.output], {
    one: "xyz",
    two: 123
  });
});
