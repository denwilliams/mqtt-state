const express = require('express');
const { register } = require('prom-client');

exports.create = (rootState, rules, port = 3000) => {
  const app = express();

  app.get('/state', (req, res) => res.json(Object.assign({}, rootState.getState(), rules.getState())));
  app.get('/state/*', (req, res) => res.json(rules.getState()[req.params[0]]));
  app.get('/metrics', (req, res) => res.type('txt').send(register.metrics()));

  return {
    start() {
      return new Promise(resolve => {
        app.listen(port, () => {
          console.log(`Listening on port ${port}`);
          resolve();
        });
      });
    }
  };
};
