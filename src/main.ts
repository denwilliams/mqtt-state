#!/usr/bin/env node
import { join } from "path";
import { createService } from "./service";
import { loadConfig } from "./config";
import { FileState } from "./file-state";

const stopSignal = () =>
  new Promise((resolve) => {
    process.once("SIGINT", resolve);
    process.once("SIGTERM", resolve);
  });

function getPersistence(config?: { redis?: string; file?: string }) {
  // if (config.data.redis) {
  //   return new RedisState(config.data.redis, interval);
  // }

  const filePath = config?.file || join(__dirname, "state.json");
  return new FileState(filePath);
}

(async () => {
  const config = await loadConfig();
  const persistence = getPersistence(config.data);
  const initialState = await persistence.load();
  const saveState = async (state: Record<string, any>) => {
    await persistence.save(state);
  };
  const service = createService(config, saveState, initialState);
  // Ready to start
  await service.start();
  console.info("Running");
  // Service is now started
  await stopSignal();
  // Shutting down
  console.info("Stopping");
  await service.stop();
  // Service is now stopped
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  process.exit(1);
});
