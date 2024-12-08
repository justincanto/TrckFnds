export const formatCurrency = (value: number | undefined) => {
  if (value === undefined) {
    return null;
  }
  return `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

export const formatPercentage = (value: number | undefined) => {
  return value === undefined ? null : `${(value * 100).toFixed(2)}%`;
};
