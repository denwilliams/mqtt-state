import { create as createReactive } from "../reactive";
import { create as createRootState } from "../root-state";
import { create as createRules } from "../rules";
import { ulid } from "ulid";
import { RuleDetails, RootState, Reactive } from "../types";

export interface TestContext {
  rootState: RootState;
  reactive: Reactive;
  createRules(rules: any[]): any;
  output: any;
  mockMqtt: any;
}

export function beforeEach(t: { context: any }) {
  const mockMqtt = {
    count: 0,
    emit(/* a, b */) {
      // console.log(a, b);
      this.count++;
    },
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

  t.context.createRules = (rulesList: RuleDetails[]) =>
    createRules(rulesList, reactive, mockMqtt);

  t.context.output = "output/" + ulid();
}
