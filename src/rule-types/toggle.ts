import { Reactive, ToggleRule } from "../types";
import { Observable, Subscriber } from "rxjs";

export function toggle(
  rule: ToggleRule & { key: string },
  reactive: Reactive,
  getValue: (path: string) => any
) {
  const {
    key,
    source,
    toggle_source: toggleSource,
    set_source: setSource,
  } = rule;

  const getNext = () => !getValue(toggleSource || key);
  const setNext = (value: boolean) => {
    return value;
  };

  const sourceStream: Observable<any> = reactive.getBinding(source);
  const setSourceStream: null | Observable<any> = setSource
    ? reactive.getBinding(setSource)
    : null;

  return Observable.create((subscriber: Subscriber<any>) => {
    const subscription = sourceStream.subscribe(
      (value) => {
        if (value === undefined) return;
        subscriber.next(getNext());
      },
      (err: Error) => subscriber.error(err),
      () => subscriber.complete()
    );

    if (setSourceStream) {
      const setSubscription = setSourceStream.subscribe(
        (value: boolean) => {
          if (value === undefined) return;
          subscriber.next(setNext(value));
        },
        (err: Error) => subscriber.error(err),
        () => subscriber.complete()
      );
    }

    subscriber.next(Boolean(getValue(toggleSource || source)));

    return subscription;
  });
}
