const { distinctUntilChanged, map } = require('rxjs/operators');

module.exports = (rule, reactive) => {
  return reactive.getBinding(rule.source)
  .pipe(map(value => Boolean(value)))
  .pipe(distinctUntilChanged());
};
