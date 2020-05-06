import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, MatchRule } from "../types";

export function match(rule: MatchRule, reactive: Reactive) {
  const matcher = new RegExp(rule.regexp);

  return reactive
    .getBinding(rule.source)
    .pipe(map((value) => matcher.test(value)))
    .pipe(distinctUntilChanged());
}
