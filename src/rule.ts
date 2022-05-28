import vm from "vm";
import { RuleConfig } from "./config";
import { BaseContext } from "./events";
import { EmitOptions } from "./mqtt";

export interface RuleContext extends BaseContext {
  key: string;
  update(value: any): void;
}

export class Rule {
  readonly key: string;
  readonly events: string[];
  readonly mqtt?: boolean | EmitOptions;
  private readonly script: vm.Script;

  constructor(details: RuleConfig) {
    this.script = new vm.Script(details.code);
    this.key = details.key;
    this.events = details.events;
    this.mqtt = details.mqtt;
  }

  exec(context: BaseContext) {
    const update = (value: any) => {
      context.state.set(this.key, value);
    };

    this.script.runInNewContext({
      ...context,
      key: this.key,
      update,
    });
  }

  getHandler() {
    return (context: BaseContext) => {
      try {
        this.exec(context);
      } catch (err) {
        console.error(
          `Error executing rule key=${this.key} eventName=${context.event.name} err="${err}"`
        );
      }
    };
  }
}
