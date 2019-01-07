const test = require("ava");
const { beforeEach } = require("./_test-helper");
const { create: createRules } = require("../rules");

test.beforeEach(beforeEach);

test("outputs from any of the sources", t => {
  const { mockMqtt, reactive, rootState } = t.context;
  const rules = createRules(
    [
      { key: "output/all/1", type: "all", sources: ["root/input/all/a"] },
      { key: "output/all/2", type: "all", sources: ["root/input/all/b"] },
      {
        key: "output/all/3",
        type: "all",
        sources: ["root/input/all/c", "root/input/all/b"]
      },
      { key: "output/all/4", type: "all", sources: ["root/input/all/c"] }
    ],
    reactive,
    mockMqtt
  );
  rootState.setValue("root/input/all/a", 123);
  rootState.setValue("root/input/all/b", 456);

  t.is(rules.getState()["output/all/1"], 123);
  t.is(rules.getState()["output/all/2"], 456);
  t.is(rules.getState()["output/all/3"], 456);
  t.is(rules.getState()["output/all/4"], undefined);
});

test("is the last value of any source", t => {
  const { mockMqtt, reactive, rootState } = t.context;
  const rules = createRules(
    [
      {
        key: "output/all/last/1",
        type: "all",
        sources: ["root/input/all/a", "root/input/all/b"]
      },
      { key: "output/all/last/2", type: "all", sources: ["root/input/all/a"] }
    ],
    reactive,
    mockMqtt
  );
  rootState.setValue("root/input/all/a", 123);
  rootState.setValue("root/input/all/b", 456);

  t.is(rules.getState()["output/all/last/1"], 456);
  t.is(rules.getState()["output/all/last/2"], 123);
});
