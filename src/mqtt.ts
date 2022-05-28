import mqtt, { IClientPublishOptions } from "mqtt";
import { Events } from "./events";

export type QoS = 0 | 1 | 2;

export interface EmitOptions {
  /**
   * the QoS
   */
  qos: QoS;
  /**
   * the retain flag
   */
  retain?: boolean;
  /**
   * whether or not mark a message as duplicate
   */
  dup?: boolean;
}

export class Mqtt {
  private client?: mqtt.MqttClient;

  constructor(
    private uri: string,
    private subscriptions: string[],
    private raw: string[]
  ) {}

  async start(events: Events) {
    // eslint-disable-next-line no-console
    console.log("Connecting to " + this.uri);
    this.client = mqtt.connect(this.uri);

    this.client.on("message", (topic, message) => {
      // message is Buffer
      let data = message.toString();

      const topicParts = topic.split("/");
      const lastPart = topicParts[topicParts.length - 1];
      if (!this.raw.includes(lastPart)) {
        try {
          data = JSON.parse(data);
        } catch (err) {
          // naive error handling
        }
      }

      events.publish(topic, data);
    });

    await new Promise<void>((resolve) => {
      this.client?.on("connect", () => {
        // eslint-disable-next-line no-console
        console.log("MQTT connected");
        this.subscriptions.forEach((s) => this.client?.subscribe(s));
        resolve();
      });
    });
  }

  async stop() {
    this.client?.end();
  }

  send(key: string, value: any, options?: EmitOptions) {
    const publishOpts: IClientPublishOptions = options || { qos: 2 };
    this.client?.publish(key, JSON.stringify(value), publishOpts, undefined);
  }
}
