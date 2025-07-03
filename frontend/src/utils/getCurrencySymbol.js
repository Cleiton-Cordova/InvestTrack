// utils/getCurrencySymbol.js
export const getCurrencySymbol = (currency) => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'BRL': return 'R$';
    default: return '';
  }
};
