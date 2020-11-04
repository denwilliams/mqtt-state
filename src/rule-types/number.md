Outputs the input as explicit `number` type. Eg converts `"100"` to `100`.

## Outputs

A value of `number` type.

## Inputs

- `source`: the topic to subscribe to for events. Can provide a value of any type.
- `distinct`: only emits output when the output value has changed

## Examples

```yaml
- key: status/number-value
  type: number
  source: some/source/string-value
```
