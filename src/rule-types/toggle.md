Toggles a value when an event is received from `source`.

## Examples

With internal toggle state:

```yml
- rule: external-toggle
  source: my/trigger/event
```

Using another value as the state to toggle:

```yml
- rule: external-toggle
  source: my/trigger/event
  toggle_source: my/toggle/value
```
