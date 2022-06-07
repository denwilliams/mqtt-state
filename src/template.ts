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
