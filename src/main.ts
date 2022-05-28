#!/usr/bin/env node
import { start } from "./index";
import { loadConfig } from "./config";

(async () => {
  const config = await loadConfig();
  await start(config);
})().catch(console.error);
