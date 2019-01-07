const test = require("ava");
const { beforeEach } = require("./_test-helper");
const { create: createRules } = require("../rules");

test.beforeEach(beforeEach);

test("repeats its source", t => {
  const { mockMqtt, reactive, rootState } = t.context;
  const rules = createRules(
    [{ key: "output/alias", type: "alias", source: "root/input/alias" }],
    reactive,
    mockMqtt
  );
  rootState.setValue("root/input/alias", 123);

  t.is(rootState.getState()["root/input/alias"], 123);
  t.is(rules.getState()["output/alias"], 123);
});
