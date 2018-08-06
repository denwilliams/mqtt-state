const { distinctUntilChanged, map } = require('rxjs/operators');

module.exports = (rule, reactive) => {
  const path = rule.field.split('.');

  return reactive
    .getBinding(rule.source)
    .pipe(
      map(x => {
        return path.reduce((obj, field) => {
          if (obj === null || obj === undefined) return null;

          return obj[field];
        }, x);
      })
    )
    .pipe(distinctUntilChanged());
};
