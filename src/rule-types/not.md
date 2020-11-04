Outputs the not of the "truthy"/"falsy" input.

## Outputs

A value of `boolean` type.

## Inputs

- `source`: the topic to subscribe to for events. Can provide a value of any type.
- `distinct`: only emits output when the output value has changed

## Examples

If its not hot it must be cold

```yaml
- key: status/hot
  type: not
  source: status/cold
```
