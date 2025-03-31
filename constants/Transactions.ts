export const depositCategories = [
  "Salary",
  "E-transfer",
  "Refund",
  "Investment",
] as const;

export type DepositCategories = (typeof depositCategories)[number];

export const withdrawalCategories = [
  "Housing",
  "Transportation",
  "Dining",
  "Groceries",
  "Entertainment",
  "Shopping",
  "Subscriptions",
  "Travel",
  "Education",
  "Fee",
] as const;

export type WithdrawalCategories = (typeof withdrawalCategories)[number];

export const categories = [
  ...depositCategories,
  ...withdrawalCategories,
  "Account Transfer",
] as const;

export type Category = (typeof categories)[number];

export type Transaction = {
  accountId: number;
  amount: bigint;
  isDeposit: boolean;
  date: Date;

  merchant: string;
  category: Category;
};

export const TRANSACTIONS: Transaction[] = [];
