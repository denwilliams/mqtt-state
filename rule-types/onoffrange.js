// turn on when outside first number
// turn off when outside second number
const { distinctUntilChanged, map } = require("rxjs/operators");

const DIRECTION_UP = 1;
const DIRECTION_DOWN = -1;

const STATE_LOW = 1;
const STATE_OFF = 2;
const STATE_HIGH = 3;

module.exports = (rule, reactive) => {
  const { low, mid, high } = rule.values;
  const {
    low: lowReturn = true,
    off: offReturn = false,
    high: highReturn = true
  } =
    rule.returns || {};

  let lastState = STATE_OFF;
  let direction = DIRECTION_UP;

  function getReturnValue(state) {
    if (state === STATE_LOW) return lowReturn;
    if (state === STATE_HIGH) return highReturn;
    return offReturn;
  }

  function getState(value) {
    if (lastState !== STATE_OFF) {
      // currently on - look for off
      lastState =
        direction === DIRECTION_UP
          ? (value < mid && lastState) || STATE_OFF
          : (value > mid && lastState) || STATE_OFF;
      return lastState;
    }

    // looking for on
    if (value < low) {
      lastState = STATE_LOW;
      direction = DIRECTION_UP;
    }

    if (value > high) {
      lastState = STATE_HIGH;
      direction = DIRECTION_DOWN;
    }

    return lastState;
  }

  return reactive
    .getBinding(rule.source)
    .pipe(
      map(value => {
        return getReturnValue(getState(value));
      })
    )
    .pipe(distinctUntilChanged());
};
