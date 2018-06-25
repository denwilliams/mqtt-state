# mqtt-state

State management for home automation based on MQTT input/output.

Allows for transformation of MQTT input events into managed state that is output as MQTT events.

TODO: prometheus metrics

## Environment

DATA_PATH
MQTT_URI

## Installing

```
npm i -g mqtt-state # TBD
```

## Running

First create a config file (see config.example.yml)

Then run:

```
CONFIG_PATH=/path/to/config.yml mqtt-state
```

## Rule Types

```
- key: myroom/temperature
  type: alias
  source: root/value/sensor/myroom/temperature
- key: myroom/toocold
  type: calculation
  op: '<'
  source: myroom/temperature
  value: 18
- key: house/temperatures
  type: merge
  sources:
    bedroom: 'myroom/temperature'
    nursery: 'room2/temperature'
- key: myroom/motion
  type: match
  source: 'root/rf433/rfin'
  regexp: '.*(56775C|D58975)$'
- key: myroom/presence
  type: activity
  interval: 60000
  sources:
    - 'myroom/motion'
- key: myroom/should_turn_on_heater
  type: logical
  op: and
  sources:
    - myroom/toocold
    - environment/dark
- key: house/presence
  type: logical
  op: or
  sources:
    - myroom/presence
    - room2/presence
```
