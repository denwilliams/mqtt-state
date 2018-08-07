const { distinctUntilChanged } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  return reactive.getBinding(rule.source).pipe(distinctUntilChanged());
};
