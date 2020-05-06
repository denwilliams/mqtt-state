import { distinctUntilChanged, map } from "rxjs/operators";
import { operators } from "./operators/calculation";
import { Reactive, CalculationRule } from "../types";

export function calculation(rule: CalculationRule, reactive: Reactive) {
  return reactive
    .getBinding(rule.source)
    .pipe(map(operators[rule.op](rule.value)))
    .pipe(distinctUntilChanged());
}
