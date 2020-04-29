import { interval } from "rxjs";
import { debounce as rxdebounce } from "rxjs/operators";
import { DebounceRule, Reactive } from "../types";

export function debounce(rule: DebounceRule, reactive: Reactive) {
  return reactive
    .getBinding(rule.source)
    .pipe(rxdebounce(() => interval(rule.interval)));
}
