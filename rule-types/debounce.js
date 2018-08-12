const { interval } = require("rxjs");
const { debounce } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  return reactive
    .getBinding(rule.source)
    .pipe(debounce(() => interval(rule.interval)));
};
