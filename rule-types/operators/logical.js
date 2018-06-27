module.exports = {
  'AND': results => results.every(r => r),
  'OR': results => results.some(r => r)
};
