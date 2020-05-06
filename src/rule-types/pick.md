Republishes a single field from a topic. Typically used to extract a primitive value from an object.

## Outputs

A value of `any` type.

## Inputs

`source`: the topic to subscribe to for events.

## Examples

Expose a temperature value from a sensor status update. Eg if the source provides `{"timestamp":"2000-01-01 00:00:00Z", "temperature": 20.3}`:

```yaml
- key: bedroom/temperature
  type: pick
  field: temperature
  source: sensor-hub/tempABCD/status
```

Works for nested values, eg if the source provides `{"timestamp":"2000-01-01 00:00:00Z", {"values":{"temperature": 20.3,"humidity":60}}`:

```yaml
- key: bedroom/temperature
  type: pick
  field: values.temperature
  source: sensor-hub/tempABCD/status
```
