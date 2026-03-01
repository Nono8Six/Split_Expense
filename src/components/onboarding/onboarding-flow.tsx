import React, { useState } from "react";
import { StepWelcome } from "./step-welcome";
import { StepUsers } from "./step-users";
import { StepAccounts } from "./step-accounts";
import { StepExpenses } from "./step-expenses";
import { StepSummary } from "./step-summary";
import { createUser } from "../../services/api/users/create-user";
import { createAccount } from "../../services/api/accounts/create-account";
import { createExpense } from "../../services/api/expenses/create-expense";
import { User, Account, Expense } from "../../types";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft } from "lucide-react";

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);

    const [users, setUsers] = useState<User[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const handleComplete = async () => {
        // Save everything conceptually
        for (const u of users) await createUser(u);
        for (const a of accounts) await createAccount(a);
        for (const e of expenses) await createExpense(e);
        onComplete();
    };

    const steps = [
        <StepWelcome onNext={() => setStep(1)} />,
        <StepUsers
            users={users}
            onAddUser={u => setUsers([...users, u])}
            onUpdateUser={u => setUsers(users.map(x => x.id === u.id ? u : x))}
            onRemoveUser={id => setUsers(users.filter(u => u.id !== id))}
            onNext={() => setStep(2)}
        />,
        <StepAccounts
            accounts={accounts}
            onAddAccount={a => setAccounts([...accounts, a])}
            onRemoveAccount={id => setAccounts(accounts.filter(a => a.id !== id))}
            onNext={() => setStep(3)}
        />,
        <StepExpenses
            users={users}
            accounts={accounts}
            expenses={expenses}
            onAddExpense={e => setExpenses([...expenses, e])}
            onRemoveExpense={id => setExpenses(expenses.filter(x => x.id !== id))}
            onNext={() => setStep(4)}
        />,
        <StepSummary
            users={users}
            accounts={accounts}
            expenses={expenses}
            onComplete={handleComplete}
        />
    ];

    const canGoBack = step > 0 && step < 4;

    return (
        <div className="fixed inset-0 bg-background text-foreground z-50 flex flex-col">
            {/* iOS Modal Header Header */}
            <header className="h-14 flex items-center px-4 shrink-0 justify-between">
                {canGoBack ? (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="flex items-center text-primary font-medium text-[17px] active:opacity-50 transition-opacity"
                    >
                        <ChevronLeft className="w-6 h-6 -ml-2" /> Retour
                    </button>
                ) : (
                    <div className="w-[80px]" /> /* spacer */
                )}

                {step > 0 && step < 4 ? (
                    <div className="flex gap-1.5 h-1.5">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-6 rounded-full transition-colors duration-300 ${i <= step ? 'bg-primary' : 'bg-primary/20'}`}
                            />
                        ))}
                    </div>
                ) : (
                    <div /> /* spacer */
                )}

                <div className="w-[80px]" /> /* spacer */
            </header>

            <main className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        className="absolute inset-0"
                    >
                        {steps[step]}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
