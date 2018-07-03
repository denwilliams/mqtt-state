exports.create = (rootState, reactive) => {
  const onTick = () => {
    rootState.setValue('root/ticker/minutes', new Date().getTime());
  };

  onTick();
  reactive.getRootBinding('root/ticker/minutes');

  setInterval(onTick, 60000);
  // setImmediate(onTick);
};
