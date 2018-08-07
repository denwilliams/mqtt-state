module.exports = rule => {
  return Object.keys(rule.cases).map(key => {
    return {
      key: rule.key + "/" + key,
      type: "match",
      source: rule.key,
      regexp: key
    };
  });
};
