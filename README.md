# mqtt-state

## v4 - breaking change

v4 marks a change in direction from v3.

Since the only real audience for this project are people who can write code, it seemed constrained to have to join basic rules together for something that would be a single line of code.

Also the only way to conditionally emit was with a filter rule, which seemed limited, and generally meant a bunch of chaining.

Being able to achieve both in a small amount of code seemed like a much better approach, so this version ditches the defined rule types, each rule will need code... however the code for each rule should be very simple. The test cases demonstrate code for most of the old rules. In many ways it is  easier to follow, document, and definitely more powerful.

_For now refer to tests for examples on usage. Almost all previous rules have been replicated there._

Pros with v4:

- A rule can conditionally emit, previously only filter rule could conditionally emit but it couldn't transform data.
- A rule can emit multiple times from a single source event.
- A rule can have more complex logic with needing to chain rules.
- A rule can emit many child topics or keys, allowing a single source to be split into multiple output values/topics from a single rule.
- A rule can have technically have async logic, although beware of sequence issues.

Note: distinct, debounce and throttle are now properties on a rule:
- distinct will only save and emit changes if the value changes from before. Note must be `===` exact match.
- debounce will only save and emit after receiving no events for the interval, good for squashing bursts into a single change, but if the flow of events is constant there may never be a break long enough to process the change.
- throttle will save an emit immediately, but then only emit once per interval. The last even while throttling is occurring will be saved and emitted once the throttle window expires.

Limitations:

1. When a rule emits child values metrics won't work as expected. Don't use metrics with such rules yet.
2. There is no cache from previous rule runs. You can access the last output of any other rule, including the current rules' child values so you could probably hack it. Because of this have't been able to figure out how to reproduce `activity`.
