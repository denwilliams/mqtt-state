import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, DoWRule } from "../types";

/*
- key: my/rule
  days:
    - 1
    - 2
    - 3
  source: root/date/emitter
*/

export function dayofweek(rule: DoWRule, reactive: Reactive) {
  const days = rule.days;

  return reactive
    .getBinding(rule.source)
    .pipe(
      map((value: string | number) => {
        const dval = new Date(value);
        const dayOfWeek = dval.getDay();

        return days.includes(dayOfWeek);
      })
    )
    .pipe(distinctUntilChanged());
}
