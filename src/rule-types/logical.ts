import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { operators } from "./operators/logical";
import { LogicalRule, Reactive } from "../types";

export function logical(rule: LogicalRule, reactive: Reactive) {
  // const keys = Object.keys(rule.sources);
  const values = Object.values(rule.sources);
  const bindings = values.map((path) => reactive.getBinding(path));
  const opName = rule.op || "AND";
  const operator = operators[opName];

  if (!operator) throw new Error("No operator found for " + opName);

  return combineLatest(...bindings).pipe(map(operator));
}
