const { Gauge } = require("prom-client");

exports.create = metricsList => {
  const metrics = {};
  metricsList.forEach(m => {
    const { name, help, labels } = m;
    const gauge = new Gauge({
      name,
      help,
      labels
    });
    metrics[name] = gauge;
  });
  return metrics;
};
