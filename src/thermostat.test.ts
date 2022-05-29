import test from "ava";
import { createTestService } from "./_test-helper";

const thermostatCode = `
const [low, mid, high] = [10, 15, 20];
const [lowReturn, off, highReturn] = ["heat", "off", "cool"];
const isHigh = event.value > high;
const isLow = event.value < low;

if (isHigh) {
  set(highReturn);
} else if (isLow) {
  set(lowReturn);
} else if (currentValue === lowReturn) {
  if (event.value >= mid) set(off);
} else if (currentValue === highReturn) {
  if (event.value <= mid) set(off);
} else {
  set(off);
}
`;

test("returns off if first value is between low-high", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: thermostatCode,
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 15);
  t.is(service.activeState.get("output"), "off");
});

test("returns on if value is below low", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: thermostatCode,
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 9);
  t.is(service.activeState.get("output"), "heat");
});

test("returns on if value is above high", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: thermostatCode,
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 21);
  t.is(service.activeState.get("output"), "cool");
});

test("becomes off if value crosses midpoint from low", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: thermostatCode,
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 9);
  t.is(service.activeState.get("output"), "heat");

  service.events.publish("input", 14);
  t.is(service.activeState.get("output"), "heat");

  service.events.publish("input", 15);
  t.is(service.activeState.get("output"), "off");
});

test("becomes off if value crosses midpoint from high", (t) => {
  const service = createTestService({
    rules: [
      {
        key: "output",
        source: thermostatCode,
        subscribe: "input",
      },
    ],
  });

  service.events.publish("input", 21);
  t.is(service.activeState.get("output"), "cool");

  service.events.publish("input", 16);
  t.is(service.activeState.get("output"), "cool");

  service.events.publish("input", 15);
  t.is(service.activeState.get("output"), "off");
});
