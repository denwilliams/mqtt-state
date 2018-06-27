const { zip } = require('rxjs');
const { map } = require('rxjs/operators');
const operators = require('./operators/logical');

module.exports = (rule, reactive) => {
  const keys = Object.keys(rule.sources);
  const values = Object.values(rule.sources);
  const bindings = values.map(path => reactive.getBinding(path));
  const operator = operators[rule.op || 'AND'];

  return zip(...bindings)
  .pipe(map(operator));
};
