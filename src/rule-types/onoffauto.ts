// returns true/false if the source is boolean
// returns the value of auto if other (eg null)
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { Reactive, OnOffAutoRule } from "../types";

export function onoffauto(rule: OnOffAutoRule, reactive: Reactive) {
  const { auto, source } = rule;

  const switchBinding = reactive.getBinding(source);
  const autoBinding = reactive.getBinding(auto);

  return combineLatest(switchBinding, autoBinding).pipe(
    map(([switchResult, autoResult]) => {
      if (typeof switchResult === "boolean") return switchResult;
      return autoResult;
    })
  );
}
