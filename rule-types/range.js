// insde/outside pair of numbers
const { distinctUntilChanged, map } = require('rxjs/operators');

module.exports = (rule, reactive) => {
  const a = rule.values[0];
  const b = rule.values[1];

  const outside = rule.outside || false;

  return reactive.getBinding(rule.source)
  .pipe(map(value => {
    if (outside) {
      return value < a || value > b;
    }
    return value > a && value < b;
  }))
  .pipe(distinctUntilChanged());
};
