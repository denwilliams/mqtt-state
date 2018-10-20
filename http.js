const express = require("express");
const { register } = require("prom-client");

exports.create = (rootState, rules, port = 3000) => {
  const app = express();

  app.use((req, res, next) => {
    if (req.query.accept) {
      req.headers.accept = req.query.accept;
    }
    next();
  });

  app.get("/state", (req, res) => {
    const state = getState(req.query);

    res.format({
      text: () => {
        const entries = Object.entries(state);
        const lines = entries.map(e => `${e[0]}: ${e[1]}`);
        res.send(lines.join("\n"));
      },
      html: () => {
        const entries = Object.entries(state);
        const lines = entries.map(e => `<strong>${e[0]}</strong>: ${e[1]}`);
        res.send(`<html><body>${lines.join("<br />")}</body></html>`);
      },
      json: () => {
        res.json(state);
      }
    });
  });

  app.get("/state/*", (req, res) => {
    const key = req.params[0];
    const value = rules.getState()[key];

    res.format({
      text: () => {
        res.send(`${key}: ${value}`);
      },
      html: () => {
        res.send(`<html><body><strong>${key}</strong>: ${value}</body></html>`);
      },
      json: () => {
        res.json(value);
      }
    });
  });
  app.get("/metrics", (req, res) => res.type("txt").send(register.metrics()));
  app.get("/rules", (req, res) => {
    const rulesList = rules.getList();

    res.format({
      text: () => {
        const ruleItems = rulesList.reduce((arr, rule) => {
          const entries = Object.entries(rule);
          const lines = entries.map(e => `${e[0]}: ${e[1]}`);
          arr.push(lines.join("\n"));
          return arr;
        }, []);
        res.send(ruleItems.join("\n\n"));
      },
      html: () => {
        const ruleItems = rulesList.reduce((arr, rule) => {
          const entries = Object.entries(rule);
          const lines = entries.map(e => `<strong>${e[0]}</strong>: ${e[1]}`);
          arr.push(lines.join("<br />"));
          return arr;
        }, []);
        res.send(`<html><body>${ruleItems.join("<br /><br />")}</body></html>`);
      },
      json: () => {
        res.json(rulesList);
      }
    });
  });

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
