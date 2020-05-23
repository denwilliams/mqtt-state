Outputs the input as explicit `number` type. Eg converts `"100"` to `100`.

_Does not emit for every source event, only when the value changes._

## Outputs

A value of `number` type.

## Inputs

`source`: the topic to subscribe to for events. Can provide a value of any type.

## Examples

```yaml
- key: status/number-value
  type: number
  source: some/source/string-value
```
