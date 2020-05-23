import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, NumberRule } from "../types";

export function number(rule: NumberRule, reactive: Reactive) {
  return reactive
    .getBinding(rule.source)
    .pipe(map((value) => Number(value)))
    .pipe(distinctUntilChanged());
}
