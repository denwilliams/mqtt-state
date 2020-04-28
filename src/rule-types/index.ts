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

// export { parallelSwitch as parallelswitch } from "./parallel-switch";

export const types = {
  activity,
  alias,
  all,
  bool,
  calculation,
  counter,
  dayofweek,
  debounce,
  logical,
  not,
  filter,
  match,
  merge,
  "merge-switch": mergeSwitch,
  "minutes-since": minutesSince,
  onoffauto,
  onoffrange,
  pick,
  range,
  switch: _switch,
  throttle,
  timeofday,
  toggle,
};
