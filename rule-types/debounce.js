const { debounce } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  return reactive.getBinding(rule.source).pipe(debounce(rule.interval));
};
