Outputs the "truthy" input as explicit `true`, and the falsy as explicit `false`.

_Does not emit for every source event, only when the value changes._

## Outputs

A value of `boolean` type.

## Inputs

`source`: the topic to subscribe to for events. Can provide a value of any type.

## Examples

Returns true if a source is defined.

```yaml
- key: status/is-defined
  type: bool
  source: some/source/may-be-null
```
