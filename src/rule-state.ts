import { EventEmitter } from "events";
import { ActiveState } from "./active-state";
import { Rule } from "./rule";

export interface ChangeEvent<T> {
  key: string;
  value: T;
  prevValue?: T;
  rule?: Rule;
}

export class RuleState extends EventEmitter {
  constructor(private activeState: ActiveState) {
    super();
  }

  set(key: string, value: any, rule?: Rule) {
    const prevValue = this.activeState.get(key);

    // Skip if not distinct
    if (rule?.distinct && prevValue === value) return;

    this.activeState.set(key, value);
    const payload: ChangeEvent<any> = { key, value, prevValue, rule };
    this.emit("change", payload);
  }
}
