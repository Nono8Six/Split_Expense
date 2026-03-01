import { z } from "zod";

/** Schéma Zod de validation pour un utilisateur */
export const UserSchema = z.object({
    id: z.string().min(1, "L'ID est requis"),
    name: z.string().min(1, "Le nom est requis"),
    avatar: z.string().optional(),
    color: z.string(),
    salary: z.number().min(0, "Le salaire doit être positif"),
});

/** Schéma Zod de validation pour un compte bancaire */
export const AccountSchema = z.object({
    id: z.string().min(1, "L'ID est requis"),
    name: z.string().min(1, "Le nom est requis"),
    type: z.enum(["PERSONAL", "JOINT"]),
    ownerId: z.string().optional(),
});

/** Schéma Zod de validation pour une dépense */
export const ExpenseSchema = z.object({
    id: z.string().min(1, "L'ID est requis"),
    name: z.string().min(1, "Le nom est requis"),
    amount: z.number().positive("Le montant doit être positif"),
    dayOfMonth: z.number().min(1).max(31),
    accountId: z.string().min(1, "L'ID du compte est requis"),
    splitType: z.enum(["EQUAL", "PROPORTIONAL", "EXACT"]),
    shares: z.record(z.string(), z.number()),
    involvedUsers: z.array(z.string()).min(1, "Au moins un utilisateur doit être impliqué"),
    category: z.string().min(1, "La catégorie est requise"),
});

/** Type DTO inferé du schéma UserSchema */
export type UserDTO = z.infer<typeof UserSchema>;
/** Type DTO inferé du schéma AccountSchema */
export type AccountDTO = z.infer<typeof AccountSchema>;
/** Type DTO inferé du schéma ExpenseSchema */
export type ExpenseDTO = z.infer<typeof ExpenseSchema>;
