import { EventEmitter } from "events";

export class State extends EventEmitter {
  private state: Record<string, any> = {};

  set(key: string, value: any) {
    this.state[key] = value;
    this.emit("change", { key, value });
  }

  get(key: string): any {
    return this.state[key];
  }
}
