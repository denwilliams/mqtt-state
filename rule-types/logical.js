const { zip } = require('rxjs');
const { map } = require('rxjs/operators');

module.exports = (rule, reactive) => {
  const keys = Object.keys(rule.sources);
  const values = Object.values(rule.sources);
  const bindings = values.map(path => reactive.getBinding(path));

  return zip(...bindings)
  .pipe(map(results => {
    return results.every(x => x);
  }));
};

