const { create: createReactive } = require("../reactive");
const { create: createRootState } = require("../root-state");
const { create: createRules } = require("../rules");
const { ulid } = require("ulid");

exports.beforeEach = t => {
  const mockMqtt = {
    count: 0,
    emit(a, b) {
      // console.log(a, b);
      this.count++;
    }
  };
  t.context.mockMqtt = mockMqtt;

  const rootState = createRootState({});
  t.context.rootState = rootState;
  // console.log(rootState);
  // rootState.subscribe(() => {
  //   console.log("x");
  // });
  const reactive = createReactive(rootState);
  t.context.reactive = reactive;

  t.context.createRules = rulesList =>
    createRules(rulesList, reactive, mockMqtt);

  t.context.output = "output/" + ulid();
};
