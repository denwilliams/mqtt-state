const test = require("ava");
const { beforeEach } = require("./_test-helper");
const { create: createRules } = require("../rules");

test.beforeEach(beforeEach);

test.skip("activity single source", t => {
  const { mockMqtt, reactive, rootState } = t.context;
  const rules = createRules(
    [
      {
        key: "output/activity/a",
        type: "activity",
        source: "root/input/alias"
      },
      {
        key: "output/activity/b",
        type: "activity",
        source: "root/input/alias"
      }
    ],
    reactive,
    mockMqtt
  );
  rootState.setValue("root/input/alias", 123);

  t.is(rootState.getState()["root/input/alias"], 123);
  t.is(rules.getState()["output/alias"], 123);
});

test.skip("activity multiple sources", t => {
  const { mockMqtt, reactive, rootState } = t.context;
  const rules = createRules(
    [
      {
        key: "output/activity/a",
        type: "activity",
        source: "root/input/alias"
      },
      {
        key: "output/activity/b",
        type: "activity",
        source: "root/input/alias"
      }
    ],
    reactive,
    mockMqtt
  );
  rootState.setValue("root/input/alias", 123);

  t.is(rootState.getState()["root/input/alias"], 123);
  t.is(rules.getState()["output/alias"], 123);
});

test.skip("activity delay", t => {
  const { mockMqtt, reactive, rootState } = t.context;
  const rules = createRules(
    [
      {
        key: "output/activity/a",
        type: "activity",
        source: "root/input/alias"
      },
      {
        key: "output/activity/b",
        type: "activity",
        source: "root/input/alias"
      }
    ],
    reactive,
    mockMqtt
  );
  rootState.setValue("root/input/alias", 123);

  t.is(rootState.getState()["root/input/alias"], 123);
  t.is(rules.getState()["output/alias"], 123);
});
