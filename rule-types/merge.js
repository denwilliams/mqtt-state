const { combineLatest } = require("rxjs");
const { map } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  const keys = Object.keys(rule.sources);
  const values = Object.values(rule.sources);
  const bindings = values.map(path => reactive.getBinding(path));

  return combineLatest(...bindings).pipe(
    map(results => {
      const merged = {};

      for (let i = 0; i < keys.length; i++) {
        merged[keys[i]] = results[i];
      }

      return merged;
    })
  );
};
