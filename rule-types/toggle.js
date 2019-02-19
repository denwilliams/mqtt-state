const { map } = require("rxjs/operators");

module.exports = (rule, reactive) => {
  let last = false;

  const stream = reactive.getBinding(rule.source).pipe(
    map(() => {
      last = !last;
      return last;
    })
  );

  // stream.subscribe(n => {
  //   last = n;
  // });

  return stream;
};
