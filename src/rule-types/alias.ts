import { distinctUntilChanged } from "rxjs/operators";
import { AliasRule, Reactive } from "../types";

export function alias(rule: AliasRule, reactive: Reactive) {
  const observable = reactive.getBinding(rule.source);
  if (!rule.distinct) return observable;

  return observable.pipe(distinctUntilChanged());
}
