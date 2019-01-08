// insde/outside pair of numbers
const { distinctUntilChanged, map } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  const a = rule.values[0];
  const b = rule.values[1];

  const outside = rule.outside || false;

  const ruleFn = outside
    ? value => value < a || value > b
    : value => value >= a && value <= b;

  return reactive
    .getBinding(rule.source)
    .pipe(map(ruleFn))
    .pipe(distinctUntilChanged());
};
