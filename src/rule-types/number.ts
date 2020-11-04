import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, NumberRule } from "../types";

export function number(rule: NumberRule, reactive: Reactive) {
  const obs = reactive
    .getBinding(rule.source)
    .pipe(map((value) => Number(value)));

  if (!rule.distinct) return obs;
  return obs.pipe(distinctUntilChanged());
}
