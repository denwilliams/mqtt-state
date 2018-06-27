const { distinctUntilChanged, map } = require('rxjs/operators');

module.exports = (rule, reactive) => {
  return reactive.getBinding(rule.source)
  .pipe(map(x => x ? x[rule.field] : null))
  .pipe(distinctUntilChanged());
};
