const { combineLatest } = require('rxjs');
const { map } = require('rxjs/operators');
const operators = require('./operators/logical');

module.exports = (rule, reactive) => {
  // const keys = Object.keys(rule.sources);
  const values = Object.values(rule.sources);
  const bindings = values.map(path => reactive.getBinding(path));
  const opName = rule.op || 'AND';
  const operator = operators[opName];

  if (!operator) throw new Error('No operator found for ' + opName);

  return combineLatest(...bindings).pipe(map(operator));
};
