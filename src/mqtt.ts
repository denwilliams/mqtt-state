import mqtt, { IClientPublishOptions } from "mqtt";
import { ActiveState } from "./active-state";
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

interface MqttService {
  start(events: Events): Promise<void>;
  stop(): Promise<void>;
  send(key: string, value: any, options?: EmitOptions): void;
}

export class MockMqtt implements MqttService {
  public sent: Array<{
    topic: string;
    message: any;
    options?: EmitOptions;
  }> = [];
  private events?: Events;

  constructor(private raw: string[], private activeState: ActiveState) {}

  async start(events: Events) {
    this.events = events;
  }
  async stop() {}

  send(topic: string, message: any, options?: EmitOptions) {
    this.sent.push({ topic, message, options });
  }

  mockIncoming(topic: string, message: string) {
    const data = parseIncomingMessage(topic, message.toString(), this.raw);
    this.activeState.set(topic, data);
    this.events?.publish(topic, data);
  }
}

export class Mqtt implements MqttService {
  private client?: mqtt.MqttClient;

  constructor(
    private uri: string,
    private subscriptions: string[],
    private raw: string[],
    private activeState: ActiveState
  ) {}

  async start(events: Events) {
    // eslint-disable-next-line no-console
    console.info("Connecting to " + this.uri);
    this.client = mqtt.connect(this.uri);

    this.client.on("message", (topic, message) => {
      // message is Buffer
      const data = parseIncomingMessage(topic, message.toString(), this.raw);
      this.activeState.set(topic, data);
      events.publish(topic, data);
    });

    await new Promise<void>((resolve) => {
      this.client?.on("connect", () => {
        // eslint-disable-next-line no-console
        console.info("MQTT connected");
        this.subscriptions.forEach((s) => this.client?.subscribe(s));
        resolve();
      });
    });
  }

  async stop() {
    this.client?.end();
  }

  send(topic: string, message: any, options?: EmitOptions) {
    const publishOpts: IClientPublishOptions = options || { qos: 2 };
    this.client?.publish(
      topic,
      JSON.stringify(message),
      publishOpts,
      undefined
    );
  }
}

function parseIncomingMessage(topic: string, message: string, raw: string[]) {
  const topicParts = topic.split("/");
  const lastPart = topicParts[topicParts.length - 1];
  if (!raw.includes(lastPart)) {
    try {
      return JSON.parse(message);
    } catch (err) {
      // naive error handling
      return message;
    }
  }
}
