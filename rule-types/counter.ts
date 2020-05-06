// increments a counter every time the source triggers
import { map } from "rxjs/operators";
import { Reactive, CounterRule } from "../types";

export function counter(rule: CounterRule, reactive: Reactive) {
  let count = 0;

  return reactive.getBinding(rule.source).pipe(map(() => ++count));
}
