import Decimal from 'decimal.js';
Decimal.set({ toExpNeg: -999, toExpPos: 999 })
const toBigNumber = (number: string | number) => {
  return new Decimal(number).toDP(18, Decimal.ROUND_DOWN);
};

export {
  toBigNumber
};