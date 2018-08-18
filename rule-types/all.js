const { merge } = require("rxjs");

module.exports = (rule, reactive) => {
  const sources = rule.sources.map(s => reactive.getBinding(s));

  return merge(...sources);
};
