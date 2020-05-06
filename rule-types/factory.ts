import { Rule, Reactive } from "../types";
import { Observable } from "rxjs";

import { types } from "./index";

type TypeKey = keyof typeof types;

export type RuleFactory = (
  rule: Rule,
  reactive: Reactive,
  getValue: (path: string) => any | undefined
) => Observable<any>;

export function getFactoryForType(key: TypeKey): RuleFactory | undefined {
  const factory = types[key];
  if (!factory) return;
  return factory as RuleFactory;
}
