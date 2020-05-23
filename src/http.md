# HTTP Server and API

A set of GET endpoints are exposed on the configured HTTP port and are described below.

## Configuration

To configure the HTTP port used, set set http.port in your configuration:

```yaml
http:
  port: 3000
```

## Endpoints

### API

Will return response in human readable `text/html` format by default. You can also request plain text or JSON for the response format.

To receive in a different format make sure to specify the content type in the request header, ie `Accept: application/json` or `Accept: text/plain`. If you can't provide this header (eg in browser) you can also specify in the query string, eg `/state?accept=application/json` or `/state?accept=text/plain`.

#### List State Values

`GET /state`

When the response is JSON returns an object containing a key-value pairs of the results.

By default returns all keys defined in rules.

To also include all keys from the root state (cached values of subscribed events) add a querystring parameter `root=true`:

```
/state?root=true
```

To fetch only specific values use the `select` querystring:

```
/state?select=bedroom/temperature
```

You can select multiple values:

```
/state?select=bedroom/temperature,bedroom/humidity
```

TODO: should not expose hidden rules unless hidden=true is specified.

#### Fetch a Single State Value

`GET /state/*`

You can fetch the value of a single key by providing the key after /state.

When the response is JSON returns the value of the key serialized as JSON, for example `"off"` for a string, `true` for boolean, `20` for a number.

Example:

```
/state/bedroom/temperature
```

#### Rules

`GET /rules`

Lists all known rules. NOTE: can also fetch in JSON format.

### Metrics

`GET /metrics`

Returns Prometheus metrics for the current state. NOTE: only works for keys with a numeric or boolean value, where boolean is represented as 0 or 1.

### Tree

`GET /tree`

Experimental visualisation of rule inheritance. Falls apart when too many nodes.
