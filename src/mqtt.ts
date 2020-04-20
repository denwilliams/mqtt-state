import mqtt, { IClientPublishOptions } from "mqtt";
import { RootState, EmitOptions, MqttEmitter, Startable } from "./types";

export class Mqtt implements MqttEmitter, Startable {
  private client?: mqtt.MqttClient;

  constructor(
    private rootState: RootState,
    private uri: string,
    private subscriptions: string[],
    private raw: string[]
  ) {}

  async start() {
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

      this.rootState.setValue("root/" + topic, data);
    });

    await new Promise((resolve) => {
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

  emit(key: string, value: any, options?: EmitOptions) {
    const publishOpts: IClientPublishOptions | undefined = options;
    this.client?.publish(key, JSON.stringify(value), publishOpts);
  }
}
