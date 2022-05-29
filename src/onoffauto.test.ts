import test from "ava";
import { createTestService } from "./_test-helper";

// use case - tri-state switch with an on, off, and auto mode,
// where the auto mode is controlled by a motion or presence detection

const tristateSwitch = `
const switchValue = state.get("input/switch");

if (typeof switchValue === "boolean") {
  set(switchValue);
} else {
  // switch is in "auto" mode
  const sensorValue = state.get("input/sensor");
  set(sensorValue);
}
`;

test("returns the boolean value of source", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: tristateSwitch,
        subscribe: ["input/switch", "input/sensor"],
      },
    ],
  });

  await service.start();
  service.mqtt.mockIncoming("input/switch", "true");
  service.mqtt.mockIncoming("input/sensor", "null");

  t.is(service.activeState.get("output"), true);

  service.mqtt.mockIncoming("input/sensor", "false");
  t.is(service.activeState.get("output"), true);

  service.mqtt.mockIncoming("input/switch", "false");
  t.is(service.activeState.get("output"), false);

  service.mqtt.mockIncoming("input/sensor", "true");
  t.is(service.activeState.get("output"), false);

  await service.stop();
});

test("returns the auto value if source is null", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: tristateSwitch,
        subscribe: ["input/switch", "input/sensor"],
      },
    ],
  });

  await service.start();
  service.mqtt.mockIncoming("input/switch", "null");
  service.mqtt.mockIncoming("input/sensor", "false");

  t.is(service.activeState.get("output"), false);

  service.mqtt.mockIncoming("input/sensor", "true");
  t.is(service.activeState.get("output"), true);

  await service.stop();
});

test("switches to/from sensor value when switch is null", async (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: tristateSwitch,
        subscribe: ["input/switch", "input/sensor"],
      },
    ],
  });

  await service.start();
  service.mqtt.mockIncoming("input/switch", "false");
  service.mqtt.mockIncoming("input/sensor", "true");

  t.is(service.activeState.get("output"), false);

  service.mqtt.mockIncoming("input/switch", "null");
  t.is(service.activeState.get("output"), true);

  service.mqtt.mockIncoming("input/switch", "false");
  t.is(service.activeState.get("output"), false);

  await service.stop();
});
