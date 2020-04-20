import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, SwitchRule } from "../types";

export function _switch(rule: SwitchRule, reactive: Reactive) {
  const cases = Object.keys(rule.cases).map((key) => {
    const matcher = new RegExp(rule.cases[key]);
    return { key, matcher };
  });

  return reactive
    .getBinding(rule.source)
    .pipe(
      map((value) => {
        for (let x of cases) {
          if (x.matcher.test(value)) return x.key;
        }
        return null;
      })
    )
    .pipe(distinctUntilChanged());
}
