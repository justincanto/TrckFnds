export const formatCurrency = (
  value: number | undefined,
  withDollarSign = true
) => {
  if (value === undefined) {
    return null;
  }
  return `${withDollarSign ? "$" : ""}${value
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

export const formatPercentage = (value: number | undefined) => {
  return value === undefined ? null : `${(value * 100).toFixed(1)}%`;
};

export const formatEvolutionCurrency = (value: number | undefined) => {
  if (value === undefined) {
    return null;
  }
  return `${value > 0 ? "+" : ""}${formatCurrency(value, false)}$`;
};

export const formatEvolutionPercentage = (value: number | undefined) => {
  if (value === undefined) {
    return null;
  }
  return `${value > 0 ? "+" : ""}${(value * 100).toFixed(1)}%`;
};
