import { ulid } from "ulid";

type StateMap = Record<string, any>;

export class ActiveState {
  version: string;
  private state: StateMap;

  constructor(initialState: StateMap = {}) {
    this.state = initialState;
    this.version = ulid();
  }

  set(key: string, value: any) {
    this.state[key] = value;
    this.version = ulid();
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
