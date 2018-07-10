const { combineLatest } = require('rxjs');
const { map } = require('rxjs/operators');

/*
- key: my/key
  type: merge-switch
  cases:
    - value: val1
      source: root/source/key1
      regexp: matchthis
    - value: val2
      source: root/source/key2
      regexp: matchthat
*/

module.exports = (rule, reactive) => {
  const sources = rule.cases.map(c => c.source);
  const values = rule.cases.map(c => c.value);
  const matchers = rule.cases.map(c => new RegExp(c.regexp));

  const bindings = sources.map(path => reactive.getBinding(path));

  return combineLatest(...bindings)
  .pipe(map(results => {
    for (let i = 0; i < results.length; i++) {
      if (matchers[i].test(results[i])) return values[i];
    }

    return null;
  }));
};

