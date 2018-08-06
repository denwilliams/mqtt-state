const { createStore } = require('redux');

exports.create = (initialState) => {
  function setToValue(obj, key, value) {
    obj[key] = value;
  }

  function setTo(obj, key, setter) {
    obj[key] = setter(obj[key]);
  }

  const actions = {
    'SET_VALUE': (state, key, value) => {
      const newState = { ...state };
      setToValue(newState, key, value);
      return newState;
    },
    'INCREMENT': (state, key) => {
      const newState = { ...state };
      setTo(newState, key, value => (value || 0) + 1);
      return newState;
    }
  };

  function appState(state = {}, action) {
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
    setValue(path, value) {
      store.dispatch({ type: 'SET_VALUE', path, value });
    },
    getState() {
      return store.getState();
    },
    subscribe: store.subscribe.bind(store)
  };
};
