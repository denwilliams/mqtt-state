const express = require("express");
const { register } = require("prom-client");

exports.create = (rootState, rules, port = 3000) => {
  const app = express();

  app.get("/state", (req, res) => res.json(getState(req.query)));
  app.get("/state/*", (req, res) => res.json(rules.getState()[req.params[0]]));
  app.get("/metrics", (req, res) => res.type("txt").send(register.metrics()));

  function getState(query) {
    const state = {};
    if (query.root) Object.assign(state, rootState.getState());
    Object.assign(state, rules.getState());

    if (!query.select) return state;

    const selectors = query.select.split(",");

    return selectors.reduce((obj, s) => {
      obj[s] = state[s];
      return obj;
    }, {});
  }

  return {
    start() {
      return new Promise(resolve => {
        app.listen(port, () => {
          // eslint-disable-next-line no-console
          console.log(`Listening on port ${port}`);
          resolve();
        });
      });
    }
  };
};
