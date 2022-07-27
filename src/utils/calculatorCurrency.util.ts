import Decimal from 'decimal.js';
Decimal.set({ toExpNeg: -11, toExpPos: 999 })
const toBigNumber = (number: string | number) => {
  return new Decimal(number).toDP(10, Decimal.ROUND_DOWN);
};

export {
  toBigNumber
};