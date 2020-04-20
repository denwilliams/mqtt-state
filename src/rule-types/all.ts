const { merge } = require("rxjs");
import { Reactive, AllRule } from "../types";

export function all(rule: AllRule, reactive: Reactive) {
  const sources = rule.sources.map((s) => reactive.getBinding(s));

  return merge(...sources);
}
