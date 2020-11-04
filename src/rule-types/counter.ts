// increments a counter every time the source triggers
import { map } from "rxjs/operators";
import { Reactive, CounterRule } from "../types";

export function counter(
  rule: CounterRule,
  reactive: Reactive,
  getValue: (path: string) => any
) {
  let count = getValue(rule.key) || 0;

  return reactive.getBinding(rule.source).pipe(map(() => ++count));
}
