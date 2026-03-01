import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { User } from "../../../types";

/**
 * Fetches all users from Firestore
 * @returns {Promise<User[]>} A promise resolving to an array of users
 */
export const fetchUsers = async (): Promise<User[]> => {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};
