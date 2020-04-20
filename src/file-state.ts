import { existsSync, readFileSync, writeFile } from "fs";
// TODO: why is this causing error when required at module?
import { Observable, Subscriber } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { StateValues, FileState } from "./types";

export function create(filePath: string): FileState {
  let next: (x: any) => void;
  // let complete;
  let stream: Observable<any>;

  function getSaveStream() {
    if (stream) return next;

    stream = Observable.create((subscriber: Subscriber<any>) => {
      next = (x: any) => subscriber.next(x);
      // complete = () => subscriber.complete();
    }).pipe(throttleTime(1000, undefined, { leading: true, trailing: true }));

    stream.subscribe((state: StateValues) => {
      // console.log('Saving...');
      writeFile(filePath, JSON.stringify(state), "utf8", (err) => {
        // eslint-disable-next-line no-console
        if (err) console.error(err);
        // console.log('Saved!');
      });
    });

    return next;
  }

  return {
    save(state: StateValues) {
      const saveStream = getSaveStream();
      saveStream(state);
    },
    load() {
      if (!existsSync(filePath)) return {};
      return JSON.parse(readFileSync(filePath, "utf8"));
    },
  };
}
