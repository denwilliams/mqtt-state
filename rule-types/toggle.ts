import { map } from "rxjs/operators";
import { Reactive, ToggleRule } from "../types";

export function toggle(
  rule: ToggleRule,
  reactive: Reactive,
  getValue: (path: string) => any
) {
  const { source, toggle_source: toggleSource } = rule;

  let last = false;

  const getNext = toggleSource
    ? () => {
        return !getValue(toggleSource);
      }
    : () => (last = !last);

  const stream = reactive.getBinding(source).pipe(
    map(() => {
      return getNext();
    })
  );

  return stream;
}
