import { distinctUntilChanged, map } from "rxjs/operators";
import { NotRule, Reactive } from "../types";

export function not(rule: NotRule, reactive: Reactive) {
  return reactive
    .getBinding(rule.source)
    .pipe(map((value) => !value))
    .pipe(distinctUntilChanged());
}
