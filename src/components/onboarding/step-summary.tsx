import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { User, Account, Expense } from "../../types";

export function StepSummary({
    users,
    accounts,
    expenses,
    onComplete
}: {
    users: User[];
    accounts: Account[];
    expenses: Expense[];
    onComplete: () => void;
}) {
    return (
        <div className="flex flex-col h-full max-w-lg mx-auto w-full pt-12 pb-8 px-4">

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
                </div>
                <h2 className="text-[28px] font-bold tracking-tight text-foreground">Tout est prêt !</h2>
                <p className="text-[15px] text-muted-foreground mt-2">Votre espace Split Expense est configuré et prêt à l'emploi.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 space-y-6">

                <div>
                    <h3 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide">Résumé</h3>
                    <div className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden divide-y divide-border">

                        <div className="flex justify-between items-center px-4 py-3.5">
                            <span className="text-[16px] text-foreground font-medium">Membres du foyer</span>
                            <span className="text-[16px] text-muted-foreground">{users.length}</span>
                        </div>

                        <div className="flex justify-between items-center px-4 py-3.5">
                            <span className="text-[16px] text-foreground font-medium">Revenu global net</span>
                            <span className="text-[16px] text-muted-foreground font-mono">{users.reduce((s, u) => s + u.salary, 0).toLocaleString("fr-FR")} €</span>
                        </div>

                        <div className="flex justify-between items-center px-4 py-3.5">
                            <span className="text-[16px] text-foreground font-medium">Comptes configurés</span>
                            <span className="text-[16px] text-muted-foreground">{accounts.length}</span>
                        </div>

                        <div className="flex justify-between items-center px-4 py-3.5">
                            <span className="text-[16px] text-foreground font-medium">Dépenses fixes / mois</span>
                            <span className="text-[16px] text-muted-foreground font-mono">{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString("fr-FR")} €</span>
                        </div>

                    </div>
                </div>

            </motion.div>

            <div className="mt-auto pt-4">
                <button
                    onClick={onComplete}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-semibold text-[17px] rounded-[16px] active-press diffusion-shadow"
                >
                    Accéder à l'Aperçu
                </button>
            </div>

        </div>
    );
}
