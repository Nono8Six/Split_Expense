import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Vérifie si la base de données Firestore est vide ou non.
 * Utile pour afficher un état vide à l'utilisateur au premier lancement.
 * @returns {Promise<boolean>} true si aucun utilisateur n'existe encore
 */
export const isDatabaseEmpty = async (): Promise<boolean> => {
    const usersCol = collection(db, "users");
    const usersSnapshot = await getDocs(usersCol);
    return usersSnapshot.empty;
};
