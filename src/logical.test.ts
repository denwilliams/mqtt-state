import test from "ava";
import { createTestService } from "./_test-helper";

test("AND", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `
        set(Boolean(state.get("input/one") && state.get("input/two")));
        `,
        subscribe: ["input/one", "input/two"],
      },
    ],
  });

  await service.start();

  service.mqtt.mockIncoming("input/one", "false");
  t.is(service.activeState.get("output"), false);

  service.mqtt.mockIncoming("input/two", "false");
  t.is(service.activeState.get("output"), false);

  service.mqtt.mockIncoming("input/two", "true");
  t.is(service.activeState.get("output"), false);

  service.mqtt.mockIncoming("input/one", "true");
  t.is(service.activeState.get("output"), true);

  service.mqtt.mockIncoming("input/two", "false");
  t.is(service.activeState.get("output"), false);

  service.mqtt.mockIncoming("input/one", "false");
  t.is(service.activeState.get("output"), false);

  await service.stop();

  t.deepEqual(service.mqtt.sent.length, 6);
});

test("OR", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: `
        set(Boolean(state.get("input/one") || state.get("input/two")));
        `,
        subscribe: ["input/one", "input/two"],
      },
    ],
  });

  await service.start();

  service.mqtt.mockIncoming("input/one", "false");
  t.is(service.activeState.get("output"), false);

  service.mqtt.mockIncoming("input/two", "false");
  t.is(service.activeState.get("output"), false);

  service.mqtt.mockIncoming("input/two", "true");
  t.is(service.activeState.get("output"), true);

  service.mqtt.mockIncoming("input/one", "true");
  t.is(service.activeState.get("output"), true);

  service.mqtt.mockIncoming("input/two", "false");
  t.is(service.activeState.get("output"), true);

  service.mqtt.mockIncoming("input/one", "false");
  t.is(service.activeState.get("output"), false);

  await service.stop();

  t.deepEqual(service.mqtt.sent.length, 6);
});
