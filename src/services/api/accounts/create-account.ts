import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Account } from "../../../types";
import { AccountSchema } from "../../../lib/schema";

/**
 * Creates a new account in Firestore
 * @param {Omit<Account, "id"> | Account} accountData - The account data to create
 * @returns {Promise<Account>} A promise resolving to the created account
 */
export const createAccount = async (accountData: Omit<Account, "id"> | Account): Promise<Account> => {
    const id = "id" in accountData && accountData.id ? accountData.id : crypto.randomUUID();
    const newAccount: Account = { ...accountData, id };
    const validated = AccountSchema.parse(newAccount) as Account;
    await setDoc(doc(db, "accounts", id), validated);
    return validated;
};
