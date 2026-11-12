export const AmountFormatter = (amount: string | number): string => {
  const value = String(amount).trim();

  // Extract currency symbol
  const currencySymbol = value.match(/^[^\d-]+/)?.[0]?.trim() ?? "";

  // Extract numeric value
  const numericAmount = Number(value.replace(/[^\d.-]/g, ""));

  if (Number.isNaN(numericAmount)) return value;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);

  return `${currencySymbol}${formattedAmount}`;
};

export const NumberFormatter = ( x: { toString: () => string; }) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");