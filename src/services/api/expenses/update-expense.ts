import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Expense } from "../../../types";
import { ExpenseSchema } from "../../../lib/schema";

/**
 * Updates an existing expense in Firestore
 * @param {Expense} expense - The full expense object to update
 * @returns {Promise<Expense>} A promise resolving to the updated expense
 */
export const updateExpense = async (expense: Expense): Promise<Expense> => {
    const validated = ExpenseSchema.parse(expense) as Expense;
    const expenseRef = doc(db, "expenses", validated.id);
    await updateDoc(expenseRef, { ...validated });
    return validated;
};
