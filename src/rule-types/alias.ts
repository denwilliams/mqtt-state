import { distinctUntilChanged } from "rxjs/operators";
import { AliasRule, Reactive } from "../types";

export function alias(rule: AliasRule, reactive: Reactive) {
  return reactive.getBinding(rule.source).pipe(distinctUntilChanged());
}
