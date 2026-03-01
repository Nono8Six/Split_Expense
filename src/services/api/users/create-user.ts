import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { User } from "../../../types";
import { UserSchema } from "../../../lib/schema";

/**
 * Crée un nouvel utilisateur dans Firestore.
 * @param userData - Les données de l'utilisateur à créer (avec ou sans ID)
 * @returns L'utilisateur créé et validé
 */
export const createUser = async (userData: Omit<User, "id"> | User): Promise<User> => {
    const id = "id" in userData && userData.id ? userData.id : crypto.randomUUID();
    const newUser: User = { ...userData, id };
    const validated = UserSchema.parse(newUser) as User;
    await setDoc(doc(db, "users", id), validated);
    return validated;
};
