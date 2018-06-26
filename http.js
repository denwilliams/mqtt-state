const express = require('express');
const { register } = require('prom-client');

exports.create = (rootState, rules, port = 3000) => {
  const app = express();

  app.get('/state', (req, res) => res.json(Object.assign({}, rootState.getState(), rules.getState())));
  app.get('/metrics', (req, res) => res.type('txt').send(register.metrics()));

  app.listen(port, () => console.log(`Listening on port ${port}`));
};
