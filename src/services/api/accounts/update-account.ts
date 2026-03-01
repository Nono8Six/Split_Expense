import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Account } from "../../../types";
import { AccountSchema } from "../../../lib/schema";

/**
 * Updates an existing account in Firestore
 * @param {Account} account - The account object to update
 * @returns {Promise<Account>} A promise resolving to the updated account
 */
export const updateAccount = async (account: Account): Promise<Account> => {
    const validated = AccountSchema.parse(account) as Account;
    const accountRef = doc(db, "accounts", validated.id);
    await updateDoc(accountRef, { ...validated });
    return validated;
};
