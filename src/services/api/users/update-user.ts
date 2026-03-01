import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { User } from "../../../types";
import { UserSchema } from "../../../lib/schema";

/**
 * Updates an existing user in Firestore
 * @param {User} user - The user object to update
 * @returns {Promise<User>} A promise resolving to the updated user
 */
export const updateUser = async (user: User): Promise<User> => {
    const validated = UserSchema.parse(user) as User;
    const userRef = doc(db, "users", validated.id);
    await updateDoc(userRef, { ...validated });
    return validated;
};
