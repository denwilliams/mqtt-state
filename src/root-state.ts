import { createStore } from "redux";
import { RootState, StateValues } from "./types";
import { observable } from "rxjs";
import { Symbol } from "symbol-observable";

export function create(initialState: StateValues): RootState {
  function setToValue(obj: StateValues, key: string, value: any) {
    obj[key] = value;
  }

  const actions = {
    SET_VALUE: (state: StateValues, key: string, value: any) => {
      const newState = { ...state };
      setToValue(newState, key, value);
      return newState;
    },
  };

  function appState(
    state: StateValues = {},
    action: { type: "SET_VALUE"; path: string; value: any }
  ) {
    const actionFn = actions[action.type];
    if (!actionFn) return state;

    return actionFn(state, action.path, action.value);
  }

  const store = createStore(appState, initialState);

  // Can't seem to find a way around this hack.
  // Seems Rxjs uses a different symbol with the current versions of the 2
  const storeAny = store as any;
  if (!storeAny[observable]) {
    console.debug("Need hack for observable symbol");
    storeAny[observable] = store[Symbol.observable];
  }

  // const unsubscribe = store.subscribe(function () {
  //   console.log(store.getState());
  // });
  // cancel listener when you don't need it
  // unsubscribe();

  return {
    store,
    setValue(path: string, value: any) {
      store.dispatch({ type: "SET_VALUE", path, value });
    },
    getState(): StateValues {
      return store.getState();
    },
    getValue(path: string) {
      return store.getState()[path];
    },
    subscribe: store.subscribe.bind(store),
  };
}
