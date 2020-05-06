import { Reactive, RootState, Startable } from "./types";

export function create(rootState: RootState, reactive: Reactive): Startable {
  const onTick = () => {
    rootState.setValue("root/ticker/minutes", new Date().getTime());
  };

  return {
    async start() {
      onTick();
      reactive.getRootBinding("root/ticker/minutes");

      setInterval(onTick, 60000);
      // setImmediate(onTick);
    },
    async stop() {},
  };
}
