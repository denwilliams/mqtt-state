import { filter as rxfilter } from "rxjs/operators";
import { FilterRule, Reactive } from "../types";

export function filter(rule: FilterRule, reactive: Reactive) {
  const matcher = new RegExp(rule.regexp);

  return reactive
    .getBinding(rule.source)
    .pipe(rxfilter((value) => matcher.test(value)));
}
