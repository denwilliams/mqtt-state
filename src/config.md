# Configuration

Configuration is provided in YAML format, either as a static file or via the Consul key-value store.

See config.example.yml for an example configuration.

## Using File Configuration

Use environment variable `CONFIG_PATH` to specify a path to configuration file.

If not specified it will look for `config.yml` in the app folder.

### Importing

To break up large config files you can import rules from separate files:

```yaml
rules:
  - import: "/path/to/rules.yml"
```

## Using Consul for Configuration

Use environment variable `CONSUL_KEY` to specify the key in the Consul KV store where configuration is located.

## Configuration Keys

No matter where the configuration is located, the keys are the same.

### mqtt

MQTT configuration.

- **mqtt.uri** `string`: URI/URL for the MQTT server. May contain credentials.
- **mqtt.subscriptions** `Array<string>`: List of topics to subscribe to (+/# wildcards allowed). Anything received here becomes the root (persisted) state and a starting point for any rules. Without any subscriptions you cannot define any rules.

Example:

```yaml
mqtt:
  uri: mqtt://192.168.86.123
  subscriptions:
    - value/#
    - home/sensor/#
    - rfsensor/+/rfin
```

### data

Data storage/persistence options. You need to provide at least 1.

- **data.file** `string`: Path to file where root state can be persisted.
- **data.redis** `string`: Redis URL to persist using Redis.

Examples:

```yaml
data:
  file: /usr/local/lib/mqtt-state/state.json
```

```yaml
data:
  redis: "redis://192.168.1.123"
```

### http

HTTP server configuration.

- **http.port** `number`: TCP port to listen on for HTTP requests.

Example:

```yaml
http:
  port: 3000
```

### metrics

Shared/named metrics. Unless `hidden` all rules receive their own metric. Define named metrics here to use across multiple keys, eg define `temperature` with a label `zone` allowing a single temperature metric to be used to describe multiple zones.

Contains an array of metric definitions with `name`, `help`, and `labels`.

Example:

```yaml
metrics:
  - name: temperature
    help: Current temperature
    labels:
      - zone
```

### rules

An array of rule definitions. The keys vary per-type, but always contain:

- **.key** `string`: The of this rule. Must be unique.
- **.type** `string`: The rule type.
- **.source** `string|object`: The key(s) to subscribe to. For subscribed (root) topics prefix with `root/`.
- **.metric** `object`: Optionally provide a named metric to publish to. If not provided one will be created by `_`underscoring the key.
- **.hidden** `boolean`:

Examples:

```yaml
rules:
  - key: bedroom/temperature
    type: alias
    source: root/value/sensor/bedroom/temperature
    metric:
      name: temperature
      labels:
        zone: bedroom
  - key: hallway/motion
    type: match
    source: "root/RF433/garage/rfin"
    regexp: ".*(59875C|D5455)$"
    hidden: true
```
