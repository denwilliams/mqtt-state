type CalcValue = any;

export const operators = {
  ">": (value: CalcValue) => (state: CalcValue) => state > value,
  "<": (value: CalcValue) => (state: CalcValue) => state < value,
  ">=": (value: CalcValue) => (state: CalcValue) => state >= value,
  "<=": (value: CalcValue) => (state: CalcValue) => state <= value,
  "==": (value: CalcValue) => (state: CalcValue) => state == value,
  "===": (value: CalcValue) => (state: CalcValue) => state === value,
};
