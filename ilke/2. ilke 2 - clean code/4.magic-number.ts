// function doMagic(price: number, transactionType: number) {
//   if (transactionType === 1) {
//     return price * 1.4 - 30;
//   }
// }

enum Transaction {
  CASH = 1,
  DEBIT = 2,
}

const TAX_RATE = 1.4;
const CASH_DISCOUNT = 30;

function doMagic(price: number, transactionType: Transaction) {
  if (transactionType === Transaction.CASH) {
    return price * TAX_RATE - CASH_DISCOUNT;
  }
}

