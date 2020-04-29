// inside/outside pair of numbers
import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, RangeRule } from "../types";

export function range(rule: RangeRule, reactive: Reactive) {
  const a = rule.values[0];
  const b = rule.values[1];

  const outside = rule.outside || false;

  const ruleFn = outside
    ? (value: number) => value < a || value > b
    : (value: number) => value >= a && value <= b;

  return reactive
    .getBinding(rule.source)
    .pipe(map(ruleFn))
    .pipe(distinctUntilChanged());
}
