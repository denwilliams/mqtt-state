# Chain Rule

A chain is not specifically a rule, but a chain or pipeline of rules with a single input to be executed in order.

Any rule that can take a single `source` can be chained, since the chain rule works by chaining the output of each step to the input of the next one.

Example:

```yaml
- key: too_hot
  source: sensor/state
  type: chain
  rules:
    - type: pick
      field: temperature
    - type: calculation
      op: ">"
      value: 20
```
