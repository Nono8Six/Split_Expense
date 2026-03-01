import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Expense } from "../../../types";

/**
 * Fetches all expenses from Firestore
 * @returns {Promise<Expense[]>} A promise resolving to an array of expenses
 */
export const fetchExpenses = async (): Promise<Expense[]> => {
    const expensesCol = collection(db, "expenses");
    const snapshot = await getDocs(expensesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
};
