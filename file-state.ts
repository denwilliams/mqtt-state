import { existsSync, readFile, writeFile } from "fs";
// TODO: why is this causing error when required at module?
import { Observable, Subscriber } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { StateValues, PersistedState } from "./types";
import { promisify } from "util";

const readFileAsync = promisify(readFile);

export function create(filePath: string): PersistedState {
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
    async load() {
      if (!existsSync(filePath)) return {};
      return JSON.parse(await readFileAsync(filePath, "utf8"));
    },
  };
}
