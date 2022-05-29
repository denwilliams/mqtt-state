# mqtt-state

## v4 - breaking change

v4 marks a change in direction from v3.

Since the only real audience for this project are people who can write code, it seemed constrained to have to join basic rules together for something that would be a single line of code.

Also the only way to conditionally emit was with a filter rule, which seemed limited, and generally meant a bunch of chaining.

Being able to achieve both in a small amount of code seemed like a much better approach, so this version ditches the defined rule types, each rule will need code... however the code for each rule should be very simple. The test cases demonstrate code for most of the old rules. In many ways it is  easier to follow, document, and definitely more powerful.

- Conditional emitting of rules for source events, eg only if certain data is available
- Multiple emitting from a source event
- Emitting many child events, or splitting a source into multiple outputs without the need for a multiple rules
- More logic without needing to chain many rules


As of yet unable to replicate previous rules:
- activity
- debounce
- throttle

TODO: debounce, child metrics, activity/timers, on/off/auto, thermostat