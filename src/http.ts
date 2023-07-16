import { Server } from "http";
import express, { Express } from "express";
import cors from "cors";
import { register } from "prom-client";
import { ActiveState } from "./active-state";

export class HttpServer {
  private readonly app: Express;
  private server?: Server;

  constructor(private activeState: ActiveState, private port: number) {
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
      // if (query.root) Object.assign(state, rootState.getState());
      // Object.assign(state, rules.getState());

      const selectedState = !req.query.select
        ? this.activeState.getAll()
        : (() => {
            const selectors = (req.query.select as string).split(",");

            return selectors.sort().reduce((obj, s) => {
              obj[s] = this.activeState.get(s);
              return obj;
            }, {} as Record<string, any>);
          })();

      res.format({
        text: () => {
          const lines = Object.entries(selectedState).map(
            (e) => `${e[0]}: ${stringValue(e[1])}`
          );
          res.send(lines.join("\n"));
        },
        html: () => {
          const lines = Object.entries(selectedState).map(
            (e) => `<strong>${e[0]}</strong>: ${stringValue(e[1])}`
          );
          res.send(`<html><body>${lines.join("<br />")}</body></html>`);
        },
        json: () => {
          res.json(selectedState);
        },
      });
    });

    app.get("/state/*", (req, res) => {
      const key = req.params[0];
      const value = this.activeState.get(key);

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

    // app.get("/rules", (req, res) => {
    //   const rulesList = rules.getList();

    //   res.format({
    //     text: () => {
    //       const ruleItems = rulesList.reduce((arr, rule) => {
    //         const entries = Object.entries(rule);
    //         const lines = entries.map((e) => `${e[0]}: ${e[1]}`);
    //         arr.push(lines.join("\n"));
    //         return arr;
    //       }, [] as string[]);
    //       res.send(ruleItems.join("\n\n"));
    //     },
    //     html: () => {
    //       const ruleItems = rulesList.reduce((arr, rule) => {
    //         const entries = Object.entries(rule);
    //         const lines = entries.map(
    //           (e) => `<strong>${e[0]}</strong>: ${e[1]}`
    //         );
    //         arr.push(lines.join("<br />"));
    //         return arr;
    //       }, [] as string[]);
    //       res.send(
    //         `<html><body>${ruleItems.join("<br /><br />")}</body></html>`
    //       );
    //     },
    //     json: () => {
    //       res.json(rulesList);
    //     },
    //   });
    // });

    // app.get("/tree", (req, res) => {
    //   res.send(renderChartTemplate(rules.getDependencyTree()));
    // });

    this.app = app;
  }

  async start() {
    await new Promise<void>((resolve) => {
      this.server = this.app.listen(this.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Listening on port ${this.port}`);
        resolve();
      });
    });
  }

  async stop() {
    if (this.server) this.server.close();
  }
}

function stringValue(val: any): string {
  if (typeof val === "object") {
    return JSON.stringify(val);
  }
  return String(val);
}
