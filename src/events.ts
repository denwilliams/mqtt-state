import { State } from "./state";

export interface EventDetails {
  name: string;
  value: any;
}

export interface BaseContext {
  event: EventDetails;
  console: any;
  state: State;
}

export type SubscriptionHandler = (context: BaseContext) => void;

export class Events {
  private subscriptions: Record<string, Array<SubscriptionHandler>> = {};
  private globalSubscriptions: Array<SubscriptionHandler> = [];

  constructor(private state: State) {
    this.state.on("change", ({ key, value }) => {
      this.publish(key, value);
    });
  }

  subscribe(name: string, fn: SubscriptionHandler) {
    if (!this.subscriptions[name]) this.subscriptions[name] = [];
    this.subscriptions[name].push(fn);
  }

  subscribeAll(fn: SubscriptionHandler) {
    this.globalSubscriptions.push(fn);
  }

  publish(name: string, value: any) {
    // console.log("PUBLISH", name, value);
    const event = { name, value };
    const context: BaseContext = {
      event,
      console,
      state: this.state,
    };

    for (const s of this.globalSubscriptions) {
      s(context);
    }

    const subscriptions = this.subscriptions[name];
    if (!subscriptions) return;

    for (const s of subscriptions) {
      s(context);
    }
  }
}
