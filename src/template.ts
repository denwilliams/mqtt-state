import vm from "vm";
import { TemplateConfig } from "./config";

export class Template {
  readonly id: string;
  readonly script: vm.Script;

  constructor(details: TemplateConfig) {
    if (!details.id) {
      throw new Error(`Missing id on template ${details.id}`);
    }
    if (!details.source) {
      throw new Error(`Missing source on template ${details.id}`);
    }

    this.script = new vm.Script(details.source);
    this.id = details.id;
  }
}

export const baseTemplates = {
  // complex
  alias: new Template({ id: "alias", source: "set(event.value)" }),
  pick: new Template({ id: "pick", source: "set(event.value[params.field])" }),

  // numeric
  inside: new Template({
    id: "inside",
    source: "set(event.value > params.min && event.value < params.max)",
  }),
  within: new Template({
    id: "within",
    source: "set(event.value >= params.min && event.value <= params.max)",
  }),
  outside: new Template({
    id: "outside",
    source: "set(event.value < params.min || event.value > params.max)",
  }),
  above: new Template({
    id: "above",
    source: "set(event.value > params.threshold)",
  }),
  below: new Template({
    id: "below",
    source: "set(event.value < params.threshold)",
  }),
  counter: new Template({
    id: "counter",
    source: "set((currentValue || 0) + 1)",
  }),

  // boolean
  bool: new Template({ id: "bool", source: "set(Boolean(event.value))" }),
  not: new Template({ id: "not", source: "set(!event.value)" }),
  toggle: new Template({ id: "not", source: "set(!currentValue)" }),
};
