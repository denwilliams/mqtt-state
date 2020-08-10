import { filter as rxfilter } from "rxjs/operators";
import { FilterRule, Reactive } from "../types";

export function filter(rule: FilterRule, reactive: Reactive) {
  const matcher = getMatcher(rule);

  return reactive
    .getBinding(rule.source)
    .pipe(rxfilter((value) => matcher(value)));
}

function getMatcher(rule: FilterRule) {
  if (rule.regexp) {
    const regexp = new RegExp(rule.regexp);
    return (str: string) => regexp.test(str);
  }
  if (rule.eq !== undefined) {
    return (val: number | string | boolean) => rule.eq === val;
  }
  return () => false;
}
