import vm from "vm";
import { BasicRuleConfig, RuleConfig, TemplateConfig } from "./config";

export class Template {
  readonly id: string;
  readonly script: vm.Script;

  constructor(private readonly details: TemplateConfig) {
    if (!details.id) {
      throw new Error(`Missing id on template ${details.id}`);
    }
    if (!details.source) {
      throw new Error(`Missing source on template ${details.id}`);
    }

    this.script = new vm.Script(details.source);
    this.id = details.id;
  }

  getRuleConfig(input: RuleConfig): RuleConfig & { script?: vm.Script } {
    const tMetric = this.details.metric;
    const tConfig =
      typeof input.template === "string" ? undefined : input.template;
    const tChildren = this.details.children;

    const mqtt = input.mqtt ?? this.details.mqtt;
    const distinct =
      input.distinct !== undefined
        ? input.distinct
        : this.details.distinct || false;
    const metric =
      input.metric ??
      (tMetric
        ? {
            name: tMetric.name,
            labels: (tMetric.labels ?? []).reduce((acc, label) => {
              acc[label] = tConfig?.labels?.[label] ?? "unknown";
              return acc;
            }, {} as Record<string, string>),
          }
        : undefined);
    const children =
      input.children ??
      (tChildren
        ? Object.entries(tChildren).reduce((acc, [childId, child]) => {
            const childMetric = child.metric;
            acc[childId] = {
              distinct: child.distinct || false,
              mqtt: child.mqtt,
              metric: childMetric
                ? {
                    name: childMetric.name,
                    labels: (childMetric.labels ?? []).reduce((acc, label) => {
                      acc[label] = tConfig?.labels?.[label] ?? "unknown";
                      return acc;
                    }, {} as Record<string, string>),
                  }
                : undefined,
            };
            return acc;
          }, {} as Record<string, BasicRuleConfig>)
        : undefined);

    return {
      key: input.key,
      subscribe: input.subscribe,
      throttle: input.throttle,
      debounce: input.debounce,
      template: input.template,
      params: input.params,
      mqtt,
      distinct,
      metric,
      children,
      source: this.details.source,
      script: this.script,
    };
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
