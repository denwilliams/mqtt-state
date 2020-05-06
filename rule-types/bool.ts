import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, BoolRule } from "../types";

export function bool(rule: BoolRule, reactive: Reactive) {
  return reactive
    .getBinding(rule.source)
    .pipe(map((value) => Boolean(value)))
    .pipe(distinctUntilChanged());
}
