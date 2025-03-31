export type Category =
  | DepositCategories
  | WithdrawalCategories
  | "Account Transfer";

export type DepositCategories =
  | "Salary"
  | "E-transfer"
  | "Refund"
  | "Investment";

export type WithdrawalCategories =
  | "Housing"
  | "Transportation"
  | "Dining"
  | "Groceries"
  | "Entertainment"
  | "Shopping"
  | "Subscriptions"
  | "Travel"
  | "Education"
  | "Fee";

export type Transaction = {
  accountId: number;
  amount: bigint;
  isDeposit: boolean;
  date: Date;

  merchant: string;
  category: Category;
};

export const TRANSACTIONS: Transaction[] = [];
