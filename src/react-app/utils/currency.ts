export const formatCurrency = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE')}`;
};

export const formatCurrencyShort = (amount: number): string => {
  return `Ksh ${amount.toLocaleString('en-KE')}`;
};
