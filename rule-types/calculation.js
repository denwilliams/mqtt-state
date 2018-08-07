const { distinctUntilChanged, map } = require("rxjs/operators");
const operators = require("./operators/calculation");

module.exports = (rule, reactive) => {
  return reactive
    .getBinding(rule.source)
    .pipe(map(operators[rule.op](rule.value)))
    .pipe(distinctUntilChanged());
};
