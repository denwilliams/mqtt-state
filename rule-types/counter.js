// increments a counter every time the source triggerx
const { map } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  let count = 0;

  return reactive.getBinding(rule.source).pipe(map(() => ++count));
};
