const { distinctUntilChanged, map } = require('rxjs/operators');

/*
- key: my/rule
  days:
    - 1
    - 2
    - 3
  source: root/date/emitter
*/

module.exports = (rule, reactive) => {
  const days = rule.days;

  return reactive.getBinding(rule.source)
  .pipe(map(value => {
    const dval = new Date(value);
    const dayOfWeek = dval.getDay();

    return days.includes(dayOfWeek);
  }))
  .pipe(distinctUntilChanged());
};
