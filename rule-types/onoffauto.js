// returns true/false if the source is boolean
// returns the value of auto if other (eg null)
const { map } = require("rxjs/operators");
const { combineLatest } = require("rxjs");

module.exports = (rule, reactive) => {
  const { auto, source } = rule;

  const switchBinding = reactive.getBinding(source);
  const autoBinding = reactive.getBinding(auto);

  return combineLatest(switchBinding, autoBinding).pipe(
    map(([switchResult, autoResult]) => {
      if (typeof switchResult === "boolean") return switchResult;
      return autoResult;
    })
  );
};
