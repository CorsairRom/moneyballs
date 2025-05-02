// let posNegSymbol = (value: number): string => {
//   return value > 0 ? '+' : '-';
// };
//tranform this in arrow function
export const useCurrencify = (
  value: number,
): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(value);
};
