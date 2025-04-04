import { faker } from "@faker-js/faker";
import { subDays } from "date-fns/subDays";

const DAYS_IN_YEAR = 365;
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30; // Approximate number of days in a month
const MAX_DAYS_AGO = DAYS_IN_YEAR * 2;

export const depositCategories = [
  "Salary",
  "E-transfer",
  "Refund",
  "Deposit",
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
  "Account Transfer",
] as const;

export type WithdrawalCategories = (typeof withdrawalCategories)[number];

export const categories = [
  ...depositCategories,
  ...withdrawalCategories,
] as const;

export type Category = (typeof categories)[number];

export type Transaction = {
  id: number;
  accountId: number;
  amount: number;
  isDeposit: boolean;
  date: Date;

  merchant: string;
  category: Category;
};

function getRandomDaysAgo(): number {
  const randomChoice = faker.number.int({ min: 1, max: 100 });

  if (randomChoice <= 40) {
    return 0;
  } else if (randomChoice <= 80) {
    return faker.number.int({ min: 1, max: DAYS_IN_WEEK });
  } else if (randomChoice <= 90) {
    return faker.number.int({ min: DAYS_IN_WEEK + 1, max: DAYS_IN_MONTH });
  }

  return faker.number.int({ min: DAYS_IN_MONTH + 1, max: MAX_DAYS_AGO });
}

function getRandomDate(): Date {
  const now = new Date();

  const daysAgo = getRandomDaysAgo();
  const hours = faker.number.int({ min: 0, max: 23 });
  const minutes = faker.number.int({ min: 0, max: 59 });
  const seconds = faker.number.int({ min: 0, max: 59 });

  const date = subDays(now, daysAgo);
  date.setHours(hours, minutes, seconds);

  return date;
}

const currentCompany = faker.company.name().toUpperCase();

function getMerchantByCategory(category: Category, isDeposit: boolean): string {
  if (category == "Account Transfer") {
    return `TRANSFER ${isDeposit ? "FROM" : "TO"} SAVINGS ACCOUNT`;
  }

  if (depositCategories.includes(category as DepositCategories)) {
    switch (category) {
      case "Salary":
        return `${currentCompany} PAYROLL`;
      case "E-transfer":
        return `${faker.person.fullName().toUpperCase()}`;
      case "Refund":
        return `${faker.company.name().toUpperCase()} REFUND`;
      case "Deposit":
        return "CASH DEPOSIT";
    }
  }

  if (withdrawalCategories.includes(category as WithdrawalCategories)) {
    switch (category) {
      case "Housing":
        return "RENT";
      case "Transportation":
        return "UBER";
      case "Dining":
        return "PIZZA PIZZA";
      case "Groceries":
        return "LOBLAWS";
      case "Entertainment":
        return "SILVER CITY CINEMA";
      case "Shopping":
        return "MASONVILLE MALL";
      case "Subscriptions":
        return `NETFLIX`;
      case "Travel":
        return "CANADA AIRLINES";
      case "Education":
        return "WESTERN UNIVERSITY TUITION";
      case "Fee":
        return "BANK FEE";
    }
  }

  return "OTHER";
}

let nextTransactionId = 0;

export function getRandomTransaction(): Transaction {
  const isDeposit = faker.datatype.boolean();
  const category = isDeposit
    ? faker.helpers.arrayElement(depositCategories)
    : faker.helpers.arrayElement(withdrawalCategories);

  return {
    id: nextTransactionId++,
    accountId: faker.number.int({ min: 1, max: 2 }),
    amount: faker.number.float({ min: 2.0, max: 4000.0, fractionDigits: 2 }),
    isDeposit,
    date: getRandomDate(),
    merchant: getMerchantByCategory(category, isDeposit),
    category,
  };
}

export function generateTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, getRandomTransaction);
}

export const TRANSACTIONS: Transaction[] = generateTransactions(200);
