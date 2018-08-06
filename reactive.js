const { from } = require('rxjs');
const { map, distinctUntilChanged } = require('rxjs/operators');

exports.create = rootState => {
  const bindings = {};

  const state$ = from(rootState.store);
  // state$.unsubscribe();

  function getRootBinding(path) {
    const key = path.startsWith('root/') ? path : `root/${path}`;
    if (bindings[key]) return bindings[key];

    // console.log('BINDING', key);
    const stream = state$
      .pipe(map(state => state[key]))
      .pipe(distinctUntilChanged());

    // eslint-disable-next-line no-console
    setTimeout(() => stream.subscribe(n => console.log(key, n)), 1);

    bindings[key] = stream;
    return stream;
  }

  function getBinding(path) {
    // console.log('getBinding', path);
    if (path.startsWith('root/')) return getRootBinding(path);

    if (!bindings[path]) throw new Error('No binding for ' + path);

    return bindings[path];
  }

  function setBinding(path, stream) {
    // console.log('setBinding', path);
    bindings[path] = stream;
  }

  return {
    state$,
    getRootBinding,
    getBinding,
    setBinding
  };
};
