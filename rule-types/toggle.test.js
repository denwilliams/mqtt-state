const test = require("ava");
const { beforeEach } = require("./_test-helper");

test.beforeEach(beforeEach);

test("toggles on stream", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "toggle",
      source: "root/input/toggle"
    }
  ]);

  t.is(rules.getState()[t.context.output], true);
  rootState.setValue("root/input/toggle", 1);
  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/toggle", 2);
  t.is(rules.getState()[t.context.output], true);
});
