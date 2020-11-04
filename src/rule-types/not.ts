import { distinctUntilChanged, map } from "rxjs/operators";
import { NotRule, Reactive } from "../types";

export function not(rule: NotRule, reactive: Reactive) {
  const obs = reactive.getBinding(rule.source).pipe(map((value) => !value));

  if (!rule.distinct) return obs;
  return obs.pipe(distinctUntilChanged());
}
