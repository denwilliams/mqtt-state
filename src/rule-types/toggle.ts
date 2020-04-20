import { map } from "rxjs/operators";
import { Reactive, ToggleRule } from "../types";

export function toggle(rule: ToggleRule, reactive: Reactive) {
  let last = false;

  const stream = reactive.getBinding(rule.source).pipe(
    map(() => {
      last = !last;
      return last;
    })
  );

  // stream.subscribe(n => {
  //   last = n;
  // });

  return stream;
}
