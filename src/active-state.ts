import { EventEmitter } from "events";
import { Rule } from "./rule";

type StateMap = Record<string, any>;

export class ActiveState {
  private state: StateMap;

  constructor(initialState: StateMap = {}) {
    this.state = initialState;
  }

  set(key: string, value: any) {
    this.state[key] = value;
  }

  get(key: string): any {
    return this.state[key];
  }

  getMany(keys: string[]): any[] {
    return keys.map((key) => this.get(key));
  }

  getAll(): StateMap {
    return { ...this.state };
  }
}
