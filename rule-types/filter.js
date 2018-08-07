const { filter } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  const matcher = new RegExp(rule.regexp);

  return reactive
    .getBinding(rule.source)
    .pipe(filter(value => matcher.test(value)));
};
