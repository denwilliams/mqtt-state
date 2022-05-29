#!/usr/bin/env node
import { create } from "./index";
import { loadConfig } from "./config";

(async () => {
  const config = await loadConfig();
  const service = create(config);
  await service.start();
})().catch(console.error);
