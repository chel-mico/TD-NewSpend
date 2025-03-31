import { faker } from "@faker-js/faker";
import { subDays } from "date-fns/subDays";

const DAYS_IN_YEAR = 365;

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

function getRandomDate(): Date {
  const now = new Date();

  const maxDaysAgo = 2 * DAYS_IN_YEAR; // Up to 2 years ago
  const daysAgo = faker.number.int({ min: 0, max: maxDaysAgo });

  const hours = faker.number.int({ min: 0, max: 23 });
  const minutes = faker.number.int({ min: 0, max: 59 });
  const seconds = faker.number.int({ min: 0, max: 59 });

  const date = subDays(now, daysAgo);
  date.setHours(hours, minutes, seconds);

  return date;
}

export const TRANSACTIONS: Transaction[] = [];
