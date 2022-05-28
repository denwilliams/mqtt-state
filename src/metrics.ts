import { Gauge } from "prom-client";
import { MetricDetails } from "./config";

export type MetricsMap = Record<string, Gauge<string>>;

export class Metrics {
  private readonly metrics: MetricsMap = {};

  constructor(metricsList: MetricDetails[]) {
    metricsList.forEach((m) => {
      const { name, help, labelNames } = m;
      const gauge = new Gauge({ name, help, labelNames });
      this.metrics[name] = gauge;
    });
  }

  getGauge(name: string): Gauge<string> {
    return this.metrics[name];
  }
}
