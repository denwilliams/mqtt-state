import { from, Observable } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { RootState } from "./types";

export function create(rootState: RootState) {
  const bindings: Record<string, Observable<any>> = {};

  const state$ = from(rootState.store);
  // state$.unsubscribe();

  function getRootBinding(path: string): Observable<any> {
    const key = path.startsWith("root/") ? path : `root/${path}`;
    if (bindings[key]) return bindings[key];

    // console.log('BINDING', key);
    const stream = state$
      .pipe(map((state: any) => state[key]))
      .pipe(distinctUntilChanged());

    // eslint-disable-next-line no-console
    // setTimeout(() => stream.subscribe(n => console.log(key, n)), 1);

    bindings[key] = stream;
    return stream;
  }

  function getBinding(path: string): Observable<any> {
    // console.log('getBinding', path);
    if (path.startsWith("root/")) return getRootBinding(path);

    if (!bindings[path]) throw new Error("No binding for " + path);

    return bindings[path];
  }

  function setBinding(path: string, stream: Observable<any>) {
    // console.log('setBinding', path);
    bindings[path] = stream;
  }

  return {
    state$,
    getRootBinding,
    getBinding,
    setBinding,
  };
}
