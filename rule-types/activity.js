const { Observable } = require('rxjs');
const { map } = require('rxjs/operators');
const { merge } = require('rxjs');

module.exports = (rule, reactive) => {
  const interval = rule.interval;

  const sources = rule.sources.map(s => reactive.getBinding(s));

  return merge(...sources)
  .pipe(bumper(interval))
};

function bumper(duration) {
  return function mySimpleOperatorImplementation(source) {
    return Observable.create(subscriber => {
      let bumper;
      const timeoutFn = () => {
        subscriber.next(false);
        clearTimeout(bumper);
        bumper = undefined;
      };
      var subscription = source.subscribe(() => {
        // console.log('bump')
        if (!bumper) subscriber.next(true);
        else clearTimeout(bumper);

        bumper = setTimeout(timeoutFn, duration);
      },
      err => subscriber.error(err),
      () => subscriber.complete());

      return subscription;
    });
  }
}
