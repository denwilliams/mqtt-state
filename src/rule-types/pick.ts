import { distinctUntilChanged, map } from "rxjs/operators";
import { PickRule, Reactive } from "../types";

export function pick(rule: PickRule, reactive: Reactive) {
  const path = rule.field.split(".");

  const observable = reactive.getBinding(rule.source).pipe(
    map((x) => {
      return path.reduce((obj, field) => {
        if (obj === null || obj === undefined) return null;

        return obj[field];
      }, x);
    })
  );
  if (!rule.distinct) return observable;

  return observable.pipe(distinctUntilChanged());
}
