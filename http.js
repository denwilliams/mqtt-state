const express = require('express');
const { register } = require('prom-client');

exports.create = (rootState, rules) => {
  const app = express();

  app.get('/state', (req, res) => res.json(Object.assign({}, rootState.getState(), rules.getState())));
  app.get('/metrics', (req, res) => res.type('txt').send(register.metrics()));

  app.listen(3000, () => console.log('Listening on port 3000!'));
};
