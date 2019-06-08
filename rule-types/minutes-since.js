const { combineLatest } = require("rxjs");
const { map } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  const { source } = rule;

  const sourceBinding = reactive.getBinding(source);
  const tickBinding = reactive.getBinding("root/ticker/minutes");

  return combineLatest(sourceBinding, tickBinding).pipe(
    map(values => {
      const [sourceDate] = values;
      const dateFrom = new Date(sourceDate).getTime();
      const dateTo = Date.now();

      return Math.round((dateTo - dateFrom) / 60000);
    })
  );
};
