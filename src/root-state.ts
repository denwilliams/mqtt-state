import { createStore } from "redux";
import { RootState, StateValues } from "./types";

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
    subscribe: store.subscribe.bind(store),
  };
}
