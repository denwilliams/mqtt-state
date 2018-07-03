// Might need to be root - emit time of day as decimal once per minute
// insde/outside pair of numbers
const { distinctUntilChanged, map } = require('rxjs/operators');

module.exports = (rule, reactive) => {
  const a = rule.values[0];
  const b = rule.values[1];

  const outside = rule.outside || false;

  return reactive.getBinding(rule.source)
  .pipe(map(value => {
    const dval = new Date(value);
    const timeOfDay = dval.getHours() + (dval.getMinutes() / 60);
    if (outside) {
      return timeOfDay < a || timeOfDay > b;
    }
    return timeOfDay > a && timeOfDay < b;
  }))
  .pipe(distinctUntilChanged());
};
