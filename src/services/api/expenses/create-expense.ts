import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Expense } from "../../../types";
import { ExpenseSchema } from "../../../lib/schema";

/**
 * Creates a new expense in Firestore
 * @param {Omit<Expense, "id"> | Expense} expenseData - The expense data to create
 * @returns {Promise<Expense>} A promise resolving to the created expense
 */
export const createExpense = async (expenseData: Omit<Expense, "id"> | Expense): Promise<Expense> => {
    const id = "id" in expenseData && expenseData.id ? expenseData.id : crypto.randomUUID();
    const newExpense: Expense = { ...expenseData, id };
    const validated = ExpenseSchema.parse(newExpense) as Expense;
    await setDoc(doc(db, "expenses", id), validated);
    return validated;
};
