import { Events } from "./events";

export class Ticker {
  private interval?: NodeJS.Timeout;
  private lastMinute?: number;
  private lastQuarter?: number;
  private lastHour?: number;

  constructor(private events: Events) {}

  private onTick = () => {
    const date = new Date();

    const body = {
      time: date.getTime(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      quarter: Math.floor(date.getMinutes() / 15) * 15,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      dayOfWeek: date.getDay() + 1,
    };

    if (this.lastHour !== body.hour) {
      this.events.publish("ticker/hour", body);
      this.lastHour = body.hour;
    }

    if (this.lastMinute !== body.minute) {
      this.events.publish("ticker/minute", body);
      this.lastMinute = body.minute;
    }

    if (this.lastQuarter !== body.quarter) {
      this.events.publish("ticker/quarter", body);
      this.lastQuarter = body.quarter;
    }

    this.events.publish("ticker/tick", body);
  };

  async start() {
    this.interval = setInterval(this.onTick, 1000);
    setImmediate(this.onTick);
  }

  async stop() {
    if (this.interval) clearInterval(this.interval);
  }
}
