import { Events } from "./events";

export class Ticker {
  private interval?: NodeJS.Timeout;

  constructor(private events: Events) {}

  private onTick = () => {
    this.events.publish("ticker/minutes", new Date().getTime());
  };

  async start() {
    this.interval = setInterval(this.onTick, 60000);
    setImmediate(this.onTick);
  }

  async stop() {
    if (this.interval) clearInterval(this.interval);
  }
}
