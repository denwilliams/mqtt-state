const test = require("ava");
const { beforeEach } = require("./_test-helper");

test.beforeEach(beforeEach);

test("returns false initially", t => {
  const { createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "onoffrange",
      source: "root/input/onoffrange",
      values: {
        low: 10,
        mid: 15,
        high: 20
      }
    }
  ]);

  t.is(rules.getState()[t.context.output], false);
});

test("returns false if first value is between low-high", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "onoffrange",
      source: "root/input/onoffrange",
      values: {
        low: 10,
        mid: 15,
        high: 20
      }
    }
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input/onoffrange", 11);
  t.is(rules.getState()[t.context.output], false);
  rootState.setValue("root/input/onoffrange", 19);
  t.is(rules.getState()[t.context.output], false);
});

test("returns true if value is below low", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "onoffrange",
      source: "root/input/onoffrange",
      values: {
        low: 10,
        mid: 15,
        high: 20
      }
    }
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input/onoffrange", 9);
  t.is(rules.getState()[t.context.output], true);
});

test("returns true if value is above high", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "onoffrange",
      source: "root/input/onoffrange",
      values: {
        low: 10,
        mid: 15,
        high: 20
      }
    }
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input/onoffrange", 21);
  t.is(rules.getState()[t.context.output], true);
});

test("becomes false true if value crosses midpoint from low", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "onoffrange",
      source: "root/input/onoffrange",
      values: {
        low: 10,
        mid: 15,
        high: 20
      }
    }
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input/onoffrange", 9);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input/onoffrange", 14);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input/onoffrange", 15);
  t.is(rules.getState()[t.context.output], false);
});

test("becomes false true if value crosses midpoint from high", t => {
  const { rootState, createRules } = t.context;
  const rules = createRules([
    {
      key: t.context.output,
      type: "onoffrange",
      source: "root/input/onoffrange",
      values: {
        low: 10,
        mid: 15,
        high: 20
      }
    }
  ]);

  t.is(rules.getState()[t.context.output], false);

  rootState.setValue("root/input/onoffrange", 21);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input/onoffrange", 16);
  t.is(rules.getState()[t.context.output], true);

  rootState.setValue("root/input/onoffrange", 15);
  t.is(rules.getState()[t.context.output], false);
});
