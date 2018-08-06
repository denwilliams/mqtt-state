const { Observable } = require('rxjs');
const { merge } = require('rxjs');

module.exports = (rule, reactive) => {
  const interval = rule.interval;

  const sources = rule.sources.map(s => reactive.getBinding(s));

  let ready = !rule.delay;
  if (rule.delay) {
    setTimeout(() => ready = true, rule.delay);
  }

  return merge(...sources)
  .pipe(bumper(interval));

  // ------

  function bumper(duration) {
    return function mySimpleOperatorImplementation(source) {
      return Observable.create(subscriber => {
        let bumper;

        const timeoutFn = () => {
          subscriber.next(false);
          clearTimeout(bumper);
          bumper = undefined;
        };

        const bump = () => {
          if (!bumper) subscriber.next(true);
          else clearTimeout(bumper);

          bumper = setTimeout(timeoutFn, duration);
        };

        const subscription = source.subscribe(
          () => {
            if (!ready) return;
            bump();
          },
          err => subscriber.error(err),
          () => subscriber.complete()
        );

        if (rule.initial) setTimeout(() => bump(), rule.delay);
        else subscriber.next(false);

        return subscription;
      });
    };
  }
};
