const { distinctUntilChanged, map } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  const matcher = new RegExp(rule.regexp);

  return reactive
    .getBinding(rule.source)
    .pipe(map(value => matcher.test(value)))
    .pipe(distinctUntilChanged());
};
