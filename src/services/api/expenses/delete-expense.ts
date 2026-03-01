import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

/**
 * Deletes an expense from Firestore by ID
 * @param {string} id - The ID of the expense to delete
 * @returns {Promise<void>} A promise that resolves when deleted
 */
export const deleteExpense = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "expenses", id));
};
