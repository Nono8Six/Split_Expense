import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Account } from "../../../types";

/**
 * Fetches all accounts from Firestore
 * @returns {Promise<Account[]>} A promise resolving to an array of accounts
 */
export const fetchAccounts = async (): Promise<Account[]> => {
    const accountsCol = collection(db, "accounts");
    const snapshot = await getDocs(accountsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account));
};
