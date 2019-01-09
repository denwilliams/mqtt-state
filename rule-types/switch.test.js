const test = require("ava");
const { beforeEach } = require("./_test-helper");

test.beforeEach(beforeEach);

test("returns the first matching key", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "switch",
      source: "root/input/switch",
      cases: {
        one: "no",
        two: "yes.",
        three: "yes1"
      }
    }
  ]);

  rootState.setValue("root/input/switch", "yes1");
  t.is(rules.getState()[t.context.output], "two");
});

test("returns null if no matching key", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "switch",
      source: "root/input/switch",
      cases: {
        one: "no",
        two: "yes.",
        three: "yes1"
      }
    }
  ]);

  rootState.setValue("root/input/switch", "wontmatch");
  t.is(rules.getState()[t.context.output], null);
});
