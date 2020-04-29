export const operators = {
  AND: (results: any[]) => results.every((r) => r),
  OR: (results: any[]) => results.some((r) => r),
};
