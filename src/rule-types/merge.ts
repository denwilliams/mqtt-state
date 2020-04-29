import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { Reactive, MergeRule } from "../types";

export function merge(rule: MergeRule, reactive: Reactive) {
  const keys = Object.keys(rule.sources);
  const values = Object.values(rule.sources);
  const bindings = values.map((path) => reactive.getBinding(path));

  return combineLatest(...bindings).pipe(
    map((results) => {
      const merged: Record<string, any> = {};

      for (let i = 0; i < keys.length; i++) {
        merged[keys[i]] = results[i];
      }

      return merged;
    })
  );
}
