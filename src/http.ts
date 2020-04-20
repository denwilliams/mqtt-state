import express from "express";
import cors from "cors";
import { register } from "prom-client";
import { render as renderChartTemplate } from "./chart-template";
import { RootState, Rules, Startable, StateValues } from "./types";

export function create(
  rootState: RootState,
  rules: Rules,
  port = 3000
): Startable {
  const app = express();

  app.use(cors({ allowedHeaders: "*" }));

  app.use((req, res, next) => {
    const accept = req.query.accept as string | undefined;
    if (accept) {
      req.headers.accept = accept;
    }
    next();
  });

  app.get("/state", (req, res) => {
    const stateUnordered: Record<string, any> = getState(req.query);

    const state: Record<string, any> = {};
    Object.keys(stateUnordered)
      .sort()
      .forEach((key) => {
        state[key] = stateUnordered[key];
      });

    res.format({
      text: () => {
        const entries = Object.entries(state);
        const lines = entries.map((e) => `${e[0]}: ${stringValue(e[1])}`);
        res.send(lines.join("\n"));
      },
      html: () => {
        const entries = Object.entries(state);
        const lines = entries.map(
          (e) => `<strong>${e[0]}</strong>: ${stringValue(e[1])}`
        );
        res.send(`<html><body>${lines.join("<br />")}</body></html>`);
      },
      json: () => {
        res.json(state);
      },
    });
  });

  app.get("/state/*", (req, res) => {
    const key = req.params[0];
    const value = rules.getState()[key];

    res.format({
      text: () => {
        res.send(`${key}: ${stringValue(value)}`);
      },
      html: () => {
        res.send(
          `<html><body><strong>${key}</strong>: ${stringValue(
            value
          )}</body></html>`
        );
      },
      json: () => {
        res.json(value);
      },
    });
  });
  app.get("/metrics", (req, res) => res.type("txt").send(register.metrics()));
  app.get("/rules", (req, res) => {
    const rulesList = rules.getList();

    res.format({
      text: () => {
        const ruleItems = rulesList.reduce((arr, rule) => {
          const entries = Object.entries(rule);
          const lines = entries.map((e) => `${e[0]}: ${e[1]}`);
          arr.push(lines.join("\n"));
          return arr;
        }, [] as string[]);
        res.send(ruleItems.join("\n\n"));
      },
      html: () => {
        const ruleItems = rulesList.reduce((arr, rule) => {
          const entries = Object.entries(rule);
          const lines = entries.map((e) => `<strong>${e[0]}</strong>: ${e[1]}`);
          arr.push(lines.join("<br />"));
          return arr;
        }, [] as string[]);
        res.send(`<html><body>${ruleItems.join("<br /><br />")}</body></html>`);
      },
      json: () => {
        res.json(rulesList);
      },
    });
  });
  app.get("/tree", (req, res) => {
    res.send(renderChartTemplate(rules.getDependencyTree()));
  });

  function getState(query: { root?: boolean; select?: string }) {
    const state: StateValues = {};
    if (query.root) Object.assign(state, rootState.getState());
    Object.assign(state, rules.getState());

    if (!query.select) return state;

    const selectors = query.select.split(",");

    return selectors.reduce((obj, s) => {
      obj[s] = state[s];
      return obj;
    }, {} as StateValues);
  }

  return {
    async start() {
      return new Promise((resolve) => {
        app.listen(port, () => {
          // eslint-disable-next-line no-console
          console.log(`Listening on port ${port}`);
          resolve();
        });
      });
    },
    async stop() {},
  };
}

function stringValue(val: any): string {
  if (typeof val === "object") {
    return JSON.stringify(val);
  }
  return String(val);
}
