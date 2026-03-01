import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

/**
 * Deletes an account from Firestore by ID
 * @param {string} id - The ID of the account to delete
 * @returns {Promise<void>} A promise that resolves when deleted
 */
export const deleteAccount = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "accounts", id));
};
