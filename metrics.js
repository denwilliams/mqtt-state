const { Gauge } = require("prom-client");

exports.create = metricsList => {
  const metrics = {};
  metricsList.forEach(m => {
    const { name, help, labelNames } = m;
    const gauge = new Gauge({ name, help, labelNames });
    metrics[name] = gauge;
  });
  return metrics;
};
