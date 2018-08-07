module.exports = {
  ">": value => state => state > value,
  "<": value => state => state < value,
  ">=": value => state => state >= value,
  "<=": value => state => state <= value,
  "==": value => state => state == value,
  "===": value => state => state === value
};
