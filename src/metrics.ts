import { Gauge } from "prom-client";
import { Metrics, MetricDetails } from "./types";

export function create(metricsList: MetricDetails[]) {
  const metrics: Metrics = {};
  metricsList.forEach((m) => {
    const { name, help, labelNames } = m;
    const gauge = new Gauge({ name, help, labelNames });
    metrics[name] = gauge;
  });
  return metrics;
}
