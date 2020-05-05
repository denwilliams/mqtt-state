Toggles a value when an event is received from `source`.

## Outputs

A `boolean` value of the current state.

## Inputs

`source`: the topic to subscribe to for events. Note that the contents of source are ignored, so it does not matter what the output of this topic is.

`toggle_source` (optional): if provided the output will be the inverse of this, and no internal toggle state is managed. It is intended that the output of this toggle is used to set whatever source represents.

## Examples

A switch that outputs true/false on alternating presses. If the output of this were to be used to control a light it would not care if the light was turned on elsewhere (ie the toggle state is not in-sync with the light state):

```yml
- rule: external-toggle
  source: kitchen/wall-switch/button-press
```

Using a wall remote button press to toggle the state of the light. In this case the toggle _is_ in sync with the light state provided `kitchen/light/is-on` is in-sync with the actual light state. eg: if there is a delay until `kitchen/light/is-on` is updated if turned on elsewhere then pressing the button again won't change anything.

```yml
- rule: external-toggle
  source: kitchen/wall-switch/button-press
  toggle_source: kitchen/light/is-on
```
