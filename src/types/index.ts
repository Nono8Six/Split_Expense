/** Représente un utilisateur de l'application */
export type User = {
  id: string;
  name: string;
  color: string;
  salary: number;
  avatar?: string;
};

/** Représente un compte bancaire (commun ou personnel) */
export type Account = {
  id: string;
  name: string;
  type: "PERSONAL" | "JOINT" | "personal" | "joint";
  ownerId?: string;
  icon?: string;
};

/** Type de répartition d'une dépense entre utilisateurs */
export type SplitType = "EQUAL" | "PROPORTIONAL" | "EXACT";

/** Représente une dépense récurrente mensuelle */
export type Expense = {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  accountId: string;
  splitType?: SplitType;
  shares?: Record<string, number>;
  involvedUsers?: string[];
  category?: string;
  color?: string;
  splits?: { userId: string; amount: number }[];
};
