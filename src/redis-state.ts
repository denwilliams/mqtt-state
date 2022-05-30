import redis from "redis";
import { promisify } from "util";

export class RedisState {
  private readonly client: redis.RedisClient;
  private readonly getAsync: (key: string) => Promise<string>;
  private readonly setAsync: (key: string, val: string) => Promise<unknown>;

  constructor(
    private redisUrl: string,
    private key: string = "mqtt-state:persistence"
  ) {
    const client = redis.createClient({ url: redisUrl });
    client.on("error", function (error) {
      console.error("Redis error:", error);
    });

    this.client = client;

    this.setAsync = promisify(client.set).bind(client);
    this.getAsync = promisify(client.get).bind(client);
  }

  async load(): Promise<Record<string, any>> {
    const json = await this.getAsync(this.key);
    if (!json) return {};
    return JSON.parse(json);
  }

  async save(state: Record<string, any>) {
    await this.setAsync(this.key, JSON.stringify(state));
    console.info(`Backed up active state to ${this.redisUrl}`);
  }
}
