import { RuleDetails } from "../types";

export function _switch(rule: RuleDetails) {
  return Object.keys(rule.cases).map((key) => {
    return {
      key: rule.key + "/" + key,
      type: "match",
      source: rule.key,
      regexp: key,
    };
  });
}
