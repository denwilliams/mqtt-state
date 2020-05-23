# Activity Rule

Outputs `true` as soon as any activity is identified on sources.

Outputs `false` after `interval` has passed.

Any event received while `true` will restart/extend the `interval` again.

NOTE: events with value === undefined are ignored.

## Resetting Before Interval

If you want to reset use a map of sources with one named "reset".

```yaml
sources:
  input: activity/input
  reset: activity/reset
```
