import { SwitchRule, MatchRule, WithDetails } from "../types";

export function _switch(
  rule: WithDetails<SwitchRule>
): WithDetails<MatchRule>[] {
  return Object.keys(rule.cases).map((key) => {
    return {
      key: rule.key + "/" + key,
      type: "match",
      source: rule.key,
      regexp: key,
    };
  });
}
