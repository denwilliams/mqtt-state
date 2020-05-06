import { Observable, merge, Subscriber } from "rxjs";
import { Reactive, ActivityRule } from "../types";

export function activity(rule: ActivityRule, reactive: Reactive) {
  const interval = rule.interval;

  const sources = rule.sources.map((s) => reactive.getBinding(s));

  let ready = !rule.delay;
  if (rule.delay) {
    setTimeout(() => (ready = true), rule.delay);
  }

  return merge(...sources).pipe(bumper(interval));

  // ------

  function bumper(duration: number) {
    return function (source: Observable<any>) {
      return Observable.create((subscriber: Subscriber<any>) => {
        let bumpTimer: NodeJS.Timeout | undefined;

        const timeoutFn = () => {
          subscriber.next(false);
          if (bumpTimer) clearTimeout(bumpTimer);
          bumpTimer = undefined;
        };

        const bump = () => {
          if (!bumpTimer) subscriber.next(true);
          else clearTimeout(bumpTimer);

          bumpTimer = setTimeout(timeoutFn, duration);
        };

        const subscription = source.subscribe(
          () => {
            if (!ready) return;
            bump();
          },
          (err: Error) => subscriber.error(err),
          () => subscriber.complete()
        );

        if (rule.initial) setTimeout(() => bump(), rule.delay);
        else subscriber.next(false);

        return subscription;
      });
    };
  }
}
