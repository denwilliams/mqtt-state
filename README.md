# mqtt-state

## v4 - breaking change

v4 marks a change in direction from v3.

Since the only real audience for this project are people who can write code, it seemed constrained to have to string basic rules together for something that would be a single line of code.

Also the only way to conditionally emit was with a filter rule, which seemed limited.

Being able to achieve both in a small amount of code seemed like a much better approach, so this version ditches the defined rule types, each rule will need code... however the code for each rule should be very simple.
