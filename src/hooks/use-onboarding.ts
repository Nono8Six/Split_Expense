import { useState } from "react";
import { User, Account, Expense } from "../types";
import { createUser } from "../services/api/users/create-user";
import { createAccount } from "../services/api/accounts/create-account";
import { createExpense } from "../services/api/expenses/create-expense";

export type OnboardingStep = "welcome" | "users" | "accounts" | "expenses" | "summary";

const STEPS: OnboardingStep[] = ["welcome", "users", "accounts", "expenses", "summary"];

interface OnboardingState {
    step: OnboardingStep;
    stepIndex: number;
    totalSteps: number;
    draftUsers: Omit<User, "id">[];
    draftAccounts: Omit<Account, "id">[];
    draftExpenses: Omit<Expense, "id">[];
    isSaving: boolean;
}

interface OnboardingActions {
    nextStep: () => void;
    prevStep: () => void;
    setDraftUsers: (users: Omit<User, "id">[]) => void;
    setDraftAccounts: (accounts: Omit<Account, "id">[]) => void;
    setDraftExpenses: (expenses: Omit<Expense, "id">[]) => void;
    saveAndComplete: (onComplete: () => void) => Promise<void>;
}

/**
 * Hook gérant l'état et la navigation de l'onboarding multi-étapes.
 * @returns L'état courant et les actions disponibles
 */
export const useOnboarding = (): OnboardingState & OnboardingActions => {
    const [stepIndex, setStepIndex] = useState(0);
    const [draftUsers, setDraftUsers] = useState<Omit<User, "id">[]>([]);
    const [draftAccounts, setDraftAccounts] = useState<Omit<Account, "id">[]>([]);
    const [draftExpenses, setDraftExpenses] = useState<Omit<Expense, "id">[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const nextStep = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    const prevStep = () => setStepIndex((i) => Math.max(i - 1, 0));

    /**
     * Sauvegarde en batch tous les drafts dans Firestore puis appelle onComplete.
     * @param onComplete - Callback appelé une fois la sauvegarde terminée
     */
    const saveAndComplete = async (onComplete: () => void) => {
        try {
            setIsSaving(true);

            // Save users first to get real IDs
            const savedUsers = await Promise.all(draftUsers.map((u) => createUser(u)));

            // Build a name→id map to resolve ownerId references
            const userIdMap: Record<string, string> = {};
            draftUsers.forEach((du, i) => {
                userIdMap[du.name] = savedUsers[i].id;
            });

            // Save accounts with resolved ownerIds
            const accountsToSave = draftAccounts.map((a) => ({
                ...a,
                ownerId: a.ownerId ? (userIdMap[a.ownerId] ?? a.ownerId) : undefined,
            }));
            const savedAccounts = await Promise.all(accountsToSave.map((a) => createAccount(a)));

            // Build account name→id map
            const accountIdMap: Record<string, string> = {};
            draftAccounts.forEach((da, i) => {
                accountIdMap[da.name] = savedAccounts[i].id;
            });

            // Save expenses with resolved user/account IDs
            const expensesToSave = draftExpenses.map((e) => ({
                ...e,
                accountId: accountIdMap[e.accountId] ?? e.accountId,
                involvedUsers: savedUsers.map((u) => u.id),
                shares: Object.fromEntries(
                    savedUsers.map((u) => [u.id, e.amount / savedUsers.length])
                ),
            }));
            await Promise.all(expensesToSave.map((e) => createExpense(e)));

            onComplete();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de l'onboarding", error);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        step: STEPS[stepIndex],
        stepIndex,
        totalSteps: STEPS.length,
        draftUsers,
        draftAccounts,
        draftExpenses,
        isSaving,
        nextStep,
        prevStep,
        setDraftUsers,
        setDraftAccounts,
        setDraftExpenses,
        saveAndComplete,
    };
};
