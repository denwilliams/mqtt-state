import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, ExpressionRule } from "../types";
import { compile } from "expression-eval";

export function expression(
  rule: ExpressionRule,
  reactive: Reactive,
  getValue: (path: string) => any
) {
  const {
    expression: exp,
    ignore_null,
    ignore_undefined,
    source,
    distinct,
  } = rule;

  const fn = compile(exp);

  const obs = reactive.getBinding(source).pipe(
    map((value) => {
      if (
        (ignore_null && value === null) ||
        (ignore_undefined && value === undefined)
      ) {
        return value;
      }

      return fn({ value, getValue });
    })
  );

  if (!distinct) return obs;

  return obs.pipe(distinctUntilChanged());
}
