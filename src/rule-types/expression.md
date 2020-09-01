# Expression Rule

Evaluates an expression declared in a string and returns the response.

## Outputs

A value of `any` type - whatever the expression returns.

## Inputs

- `source`: the topic to subscribe to for events. The contents of this are republished to the output.
- `distinct`: only emits output when the output value has changed

## Expressions

Written as a string with 2 variables in scope:

- `value` contains the input value from the `source` input that triggered the expression call
- `getValue` is a function to get the current state of any state

## Examples

Format the raw temperature input to 1 decimal place

```yaml
- key: bedroom/temperature
  type: expression
  source: sensor-hub/tempABCD/temperature-raw
  ignore_undefined: true
  ignore_null: true
  expression: "value.toFixed(1)"
```

Output true if the temperature is the same as another

```yaml
- key: is_same_temperature
  type: expression
  source: bedroom/temperature
  ignore_undefined: true
  ignore_null: true
  expression: "value === getValue('kitchen/temperature')"
```
