export type User = {
  id: string;
  name: string;
  color: string;
  salary: number;
  avatar?: string;
};

export type Account = {
  id: string;
  name: string;
  type: "PERSONAL" | "JOINT";
  ownerId?: string;
};

export type SplitType = "EQUAL" | "PERCENTAGE" | "EXACT" | "SHARES" | "PROPORTIONAL";

export type Expense = {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number; // 1-31
  accountId: string; // Account ID from which it is paid
  splitType: SplitType;
  shares: Record<string, number>; // User ID -> Amount they owe
  involvedUsers: string[]; // User IDs involved in this expense
  category: string;
  color?: string; // Fallback color if no icon
};
