import { combineLatest } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { Reactive, MergeSwitchRule } from "../types";

/*
- key: my/key
  type: merge-switch
  cases:
    - value: val1
      source: root/source/key1
      regexp: matchthis
    - value: val2
      source: root/source/key2
      regexp: matchthat
    - value: val2
      source: root/source/key2
      eq: true
*/

export function mergeSwitch(rule: MergeSwitchRule, reactive: Reactive) {
  const sources = rule.cases.map((c) => c.source);
  const values = rule.cases.map((c) => c.value);
  const matchers = rule.cases.map((c) => {
    if (c.regexp) {
      const regexp = new RegExp(c.regexp);
      return (str: string) => regexp.test(str);
    }
    if (c.eq !== undefined) {
      return (val: number | string | boolean) => c.eq === val;
    }
    return () => false;
  });

  const bindings = sources.map((path) => reactive.getBinding(path));

  const observable = combineLatest(...bindings).pipe(
    map((results) => {
      for (let i = 0; i < results.length; i++) {
        if (matchers[i](results[i])) return values[i];
      }

      return null;
    })
  );

  if (!rule.distinct) return observable;

  return observable.pipe(distinctUntilChanged());
}
