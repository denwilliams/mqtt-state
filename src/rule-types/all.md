Republishes all events from any source. Typically used to publish a root (input) value on a topic to expose metrics, or to allow for a more logical path and grouping data and events.

## Outputs

A value of `any` type.

## Inputs

`sources`: the topics to subscribe to for events. The contents of these are republished to the output.

## Examples

Expose a multiple motion sensors on a single topic.

```yaml
- key: kitchen/motion-event
  type: true
  sources:
    - sensor-hub/motion001/motion-detected
    - sensor-hub/motion002/motion-detected
    - sensor-hub/motion003/motion-detected
```
