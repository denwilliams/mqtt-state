const { interval } = require("rxjs");
const { throttle } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  return reactive
    .getBinding(rule.source)
    .pipe(throttle(() => interval(rule.interval)));
};
