import { Observable, merge, Subscriber } from "rxjs";
import { Reactive, ActivityRule } from "../types";

export function activity(rule: ActivityRule, reactive: Reactive) {
  const interval = rule.interval;

  let inputKeys: string[] = [];
  let resetKey: string | null = null;
  if (Array.isArray(rule.sources)) {
    inputKeys = rule.sources;
  } else if (rule.sources) {
    const { reset, ...inputs } = rule.sources;
    resetKey = reset;
    inputKeys = Object.values(inputs);
  } else if (rule.source) {
    inputKeys = [rule.source];
  }

  const inputSources = inputKeys.map((s) => reactive.getBinding(s));

  let ready = false;
  if (rule.delay) {
    setTimeout(() => (ready = true), rule.delay);
  }
  let clear: null | (() => void) = null;

  if (resetKey) {
    reactive.getBinding(resetKey).subscribe((value) => {
      if (value === undefined) return;
      if (clear) clear();
    });
  }

  return merge(...inputSources).pipe(bumper(interval));

  // ------

  // TODO: this has gotten very hacky, need to refactor
  function bumper(duration: number) {
    return function (source: Observable<any>) {
      return Observable.create((subscriber: Subscriber<any>) => {
        let bumpTimer: NodeJS.Timeout | undefined;

        const timeoutFn = () => {
          subscriber.next(false);
          if (bumpTimer) clearTimeout(bumpTimer);
          bumpTimer = undefined;
        };
        clear = () => {
          timeoutFn();
        };

        const bump = () => {
          if (!bumpTimer) {
            subscriber.next(true);
          } else {
            clearTimeout(bumpTimer);
          }

          bumpTimer = setTimeout(timeoutFn, duration);
        };

        const subscription = source.subscribe(
          (value) => {
            if (!ready || value === undefined) return;
            bump();
          },
          (err: Error) => subscriber.error(err),
          () => subscriber.complete()
        );

        if (rule.initial) {
          setTimeout(() => bump(), rule.delay || 0);
        } else {
          subscriber.next(false);
        }

        ready = !rule.delay;

        return subscription;
      });
    };
  }
}
