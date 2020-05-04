import redis from "redis";
import { promisify } from "util";
import { Observable, Subscriber } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { StateValues, PersistedState } from "./types";

export function create(redisUrl: string): PersistedState {
  const client = redis.createClient({ url: redisUrl });

  client.on("error", function (error) {
    console.error("Redis error:", error);
  });

  const getAsync = promisify(client.get).bind(client);

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
      console.log("Persisting to Redis...");
      client.set("mqtt-state:persistence", JSON.stringify(state), (err) => {
        if (err) console.error(err);
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
      const json = await getAsync("mqtt-state:persistence");
      if (!json) return {};
      return JSON.parse(json);
    },
  };
}
