import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { activity } from "./activity";
import { alias } from "./alias";
import { all } from "./all";
import { bool } from "./bool";
import { calculation } from "./calculation";
import { counter } from "./counter";
import { dayofweek } from "./dayofweek";
import { debounce } from "./debounce";
import { logical } from "./logical";
import { not } from "./not";
import { filter } from "./filter";
import { match } from "./match";
import { merge } from "./merge";
import { mergeSwitch } from "./merge-switch";
import { minutesSince } from "./minutes-since";
import { onoffauto } from "./onoffauto";
import { onoffrange } from "./onoffrange";
import { pick } from "./pick";
import { range } from "./range";
import { _switch } from "./switch";
import { throttle } from "./throttle";
import { timeofday } from "./timeofday";
import { toggle } from "./toggle";
import { Reactive, ParallelSwitchRule } from "../types";

const subrules = {
  activity,
  alias,
  bool,
  calculation,
  dayofweek,
  debounce,
  logical,
  not,
  filter,
  match,
  merge,
  "merge-switch": mergeSwitch,
  onoffrange,
  pick,
  range,
  switch: _switch,
  throttle,
  timeofday,
};

// Returns a single string value (being the case "key") for the first truthy case.
// If none match then null.
/*
- key: my/key
  type: parallel-switch
  cases:
    val1:
      type: calculation
      op: '>'
      source: root/source/key1
      value: 20
    val2:
      type: calculation
      op: '==='
      source: root/source/key2
      value: 0
*/

export function parallelSwitch(rule: ParallelSwitchRule, reactive: Reactive) {
  const caseValues = Object.keys(rule.cases);
  const cases = Object.values(rule.cases);
  const bindings = cases.map((c) => {
    // Too much effort to get types cooperating here
    const factory = subrules[c.type] as any | undefined;
    if (!factory) {
      throw new Error("Unsupported subrule " + c.type);
    }
    return factory(c, reactive);
  });

  return combineLatest(...bindings).pipe(
    map((results) => {
      for (let i = 0; i < results.length; i++) {
        if (results[i]) return caseValues[i];
      }

      return null;
    })
  );
}
