// Might need to be root - emit time of day as decimal once per minute
// insde/outside pair of numbers
const { distinctUntilChanged, map } = require('rxjs/operators');

module.exports = (rule, reactive) => {
  const a = rule.values[0];
  const b = rule.values[1];
  let a2 = a;
  let b2 = b;

  if (b < a) {
    // crosses over to next day
    a2 = a - 24;
    b2 = b + 24;
  }

  const outside = rule.outside || false;

  return reactive.getBinding(rule.source)
  .pipe(map(value => {
    const dval = new Date(value);
    const timeOfDay = dval.getHours() + (dval.getMinutes() / 60);

    if (outside) return (timeOfDay < a || timeOfDay > b2)
      && (timeOfDay < a2 || timeOfDay > b);

    return (timeOfDay > a && timeOfDay < b2)
      || (timeOfDay > a2 && timeOfDay < b);
  }))
  .pipe(distinctUntilChanged());
};
