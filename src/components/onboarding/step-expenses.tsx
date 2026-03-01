import React, { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { User, Account, Expense } from "../../types";
import { motion } from "motion/react";

export function StepExpenses({
    users,
    accounts,
    expenses,
    onAddExpense,
    onRemoveExpense,
    onNext
}: {
    users: User[];
    accounts: Account[];
    expenses: Expense[];
    onAddExpense: (e: Expense) => void;
    onRemoveExpense: (id: string) => void;
    onNext: () => void;
}) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [accountId, setAccountId] = useState(accounts[0]?.id || "");
    const [dayOfMonth, setDayOfMonth] = useState<number>(1);

    const handleAdd = () => {
        const parsedAmount = parseFloat(amount.replace(",", "."));
        if (!name.trim() || isNaN(parsedAmount) || !accountId) return;

        const baseSplits = users.map(u => ({ userId: u.id, amount: parsedAmount / users.length }));

        onAddExpense({
            id: "e" + Date.now().toString(),
            name: name.trim(),
            amount: parsedAmount,
            accountId,
            dayOfMonth,
            splits: baseSplits
        });
        setName("");
        setAmount("");
    };

    return (
        <div className="flex flex-col h-full max-w-lg mx-auto w-full pt-12 pb-8 px-4">

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                <h2 className="text-[28px] font-bold tracking-tight text-foreground">Dépenses fixes</h2>
                <p className="text-[15px] text-muted-foreground mt-2">Loyer, internet, énergie... Ajoutez vos abonnements mensuels.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden divide-y divide-border mb-8">
                <div className="flex items-center px-4 py-3.5">
                    <span className="w-24 text-[16px] text-foreground font-medium">Libellé</span>
                    <input
                        type="text"
                        placeholder="Ex: Loyer"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[16px] text-right text-foreground placeholder:text-muted-foreground/50"
                    />
                </div>
                <div className="flex items-center px-4 py-3.5">
                    <span className="w-24 text-[16px] text-foreground font-medium">Montant</span>
                    <div className="flex-1 flex justify-end items-center">
                        <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                            className="bg-transparent border-none outline-none text-[16px] text-right text-foreground placeholder:text-muted-foreground/50 w-[100px]"
                        />
                        <span className="text-[16px] text-muted-foreground ml-1">€</span>
                    </div>
                </div>
                <div className="flex items-center px-4 py-3.5">
                    <span className="w-24 text-[16px] text-foreground font-medium">Jour</span>
                    <input
                        type="number"
                        min="1" max="31"
                        placeholder="1"
                        value={dayOfMonth || ""}
                        onChange={e => setDayOfMonth(parseInt(e.target.value))}
                        className="flex-1 bg-transparent border-none outline-none text-[16px] text-right text-foreground placeholder:text-muted-foreground/50"
                    />
                </div>

                {accounts.length > 0 && (
                    <div className="flex items-center px-4 py-3.5 relative">
                        <span className="w-24 text-[16px] text-foreground font-medium">Compte</span>
                        <select
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            className="flex-1 appearance-none bg-transparent border-none outline-none text-[16px] text-muted-foreground cursor-pointer rtl text-right"
                            dir="rtl"
                        >
                            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                )}

                <button
                    onClick={handleAdd}
                    disabled={!name.trim() || !amount}
                    className="w-full flex items-center justify-center gap-2 py-4 text-[16px] font-semibold text-primary disabled:opacity-30 disabled:font-normal active-press hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Ajouter cette dépense
                </button>
            </motion.div>

            {expenses.length > 0 && (
                <div className="flex-1 overflow-y-auto no-scrollbar -mx-4 px-4 pb-4">
                    <h3 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide">Dépenses prévues</h3>
                    <div className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden divide-y divide-border">
                        {expenses.map((e) => {
                            const account = accounts.find(a => a.id === e.accountId);
                            return (
                                <motion.div key={e.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-4 px-4 py-3">
                                    <div className="w-10 h-10 rounded-[10px] bg-secondary flex items-center justify-center shrink-0 border border-border overflow-hidden">
                                        <img
                                            src={`https://logo.clearbit.com/${e.name.toLowerCase().replace(/\s+/g, '')}.com`}
                                            alt={e.name}
                                            className="w-full h-full object-cover"
                                            onError={ev => { ev.currentTarget.style.display = 'none'; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[16px] font-semibold text-foreground truncate">{e.name}</p>
                                        <p className="text-[13px] text-muted-foreground">{account?.name || "Inconnu"} · Le {e.dayOfMonth}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[16px] font-bold text-foreground">{e.amount.toFixed(2)} €</p>
                                    </div>
                                    <button
                                        onClick={() => onRemoveExpense(e.id)}
                                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-destructive active-press shrink-0 ml-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mt-auto pt-4">
                <button
                    onClick={onNext}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-semibold text-[17px] rounded-[16px] active-press diffusion-shadow"
                >
                    {expenses.length > 0 ? "Continuer" : "Passer cette étape"} <ArrowRight className="w-5 h-5" />
                </button>
            </div>

        </div>
    );
}
