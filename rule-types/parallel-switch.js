const { combineLatest } = require('rxjs');
const { map } = require('rxjs/operators');

const subrules = {};
subrules.activity = require('./activity');
subrules.alias = require('./alias');
subrules.bool = require('./bool');
subrules.calculation = require('./calculation');
subrules.dayofweek = require('./dayofweek');
subrules.debounce = require('./debounce');
subrules.logical = require('./logical');
subrules.not = require('./not');
subrules.filter = require('./filter');
subrules.match = require('./match');
subrules.merge = require('./merge');
subrules['merge-switch'] = require('./merge-switch');
subrules.onoffrange = require('./onoffrange');
subrules.pick = require('./pick');
subrules.range = require('./range');
subrules.switch = require('./switch');
subrules.throttle = require('./throttle');
subrules.timeofday = require('./timeofday');

// Returns a single string value for the case that first matches.
// If none match then null.
/*
- key: my/key
  type: parallel-switch
  cases:
    val1:
      type: calculation
      op: '>'
      source: root/source/key1
      value: 20
    val1:
      type: calculation
      op: '==='
      source: root/source/key2
      value: 0
*/

module.exports = (rule, reactive) => {
  const caseValues = Object.keys(rule.cases);
  const cases = Object.values(rule.cases);
  const bindings = cases.map(c => subrules[c.type](c, reactive));

  return combineLatest(...bindings)
  .pipe(map(results => {
    for (let i = 0; i < results.length; i++) {
      if (results[i]) return caseValues[i];
    }

    return null;
  }));
};

