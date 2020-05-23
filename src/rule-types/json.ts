import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, JsonRule } from "../types";

export function json(rule: JsonRule, reactive: Reactive) {
  return reactive
    .getBinding(rule.source)
    .pipe(map((value) => JSON.parse(value)))
    .pipe(distinctUntilChanged());
}
