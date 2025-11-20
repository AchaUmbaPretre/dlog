export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return new Intl.NumberFormat("fr-FR").format(value);
};