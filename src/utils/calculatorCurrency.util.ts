import Decimal from 'decimal.js';
Decimal.set({ toExpNeg: -11, toExpPos: 999 })
const toBigNumber = (number: string | number) => {
  return new Decimal(number);
};

export {
  toBigNumber
};