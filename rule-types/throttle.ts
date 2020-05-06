import { interval } from "rxjs";
import { throttle as rxjsThrottle } from "rxjs/operators";
import { Reactive, ThrottleRule } from "../types";

export function throttle(rule: ThrottleRule, reactive: Reactive) {
  return reactive
    .getBinding(rule.source)
    .pipe(rxjsThrottle(() => interval(rule.interval)));
}
