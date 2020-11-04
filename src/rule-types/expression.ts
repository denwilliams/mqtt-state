import { Observable, Subscriber } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { Reactive, ExpressionRule } from "../types";
// import { compile } from "expression-eval";

const expressionVars = {
  Math,
  JSON,
  Object,
};

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
    sources,
    distinct,
  } = rule;

  // const fn = compile(exp);
  const fn = new Function(
    "value",
    "values",
    "name",
    "getValue",
    '"use strict";return (' + exp + ")"
  );

  const sourceSet = sources || { default: source as string };

  const getNext = (value: any, name: string) => {
    if (
      (ignore_null && value === null) ||
      (ignore_undefined && value === undefined)
    ) {
      return value;
    }

    const values = Object.entries(sourceSet).reduce((obj, [name, key]) => {
      obj[name] = getValue(key);
      return obj;
    }, {} as Record<string, any>);

    return fn(value, values, name, getValue); //, ...expressionVars);
  };

  const rootObservable = Observable.create((subscriber: Subscriber<any>) => {
    Object.entries(sourceSet).forEach(([name, key]) => {
      const sourceObs = reactive.getBinding(key);

      sourceObs.subscribe((value) => {
        const nextValue = getNext(value, name);
        if (nextValue !== undefined) subscriber.next(nextValue);
      });
    });
  });

  if (!distinct) return rootObservable;

  return rootObservable.pipe(distinctUntilChanged());
}
