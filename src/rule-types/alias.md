Republishes a topic on a new path. Typically used to publish a root (input) value on a topic to expose metrics, or to allow for a more logical path and grouping data and events.

## Outputs

A value of `any` type.

## Inputs

- `source`: the topic to subscribe to for events. The contents of this are republished to the output.
- `distinct`: only emits output when the output value has changed

## Examples

Expose a temperature sensor input as a room's temperature.

```yaml
- key: bedroom/temperature
  type: alias
  source: sensor-hub/tempABCD/temperature-raw
```
