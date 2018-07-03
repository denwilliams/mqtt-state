// turn on when outside first number
// turn off when outside second number
const { distinctUntilChanged, map } = require('rxjs/operators');

module.exports = (rule, reactive) => {
  const {low, mid, high} = rule.values;

  let lastResult = false;
  let direction = 1;

  return reactive.getBinding(rule.source)
  .pipe(map(value => {
    if (lastResult) {
      // currently on - look for off
      return (direction) ? value > mid : value < mid;
    }

    // looking for on
    if (value < low) {
      lastResult = true;
      direction = 1;
      return true;
    }

    if (value > high) {
      lastResult = true;
      direction = -1;
      return true;
    }

    return false;
  }))
  .pipe(distinctUntilChanged());
};
