import React, { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Account } from "../../types";
import { motion } from "motion/react";

export function StepAccounts({
    accounts,
    onAddAccount,
    onRemoveAccount,
    onNext
}: {
    accounts: Account[];
    onAddAccount: (a: Account) => void;
    onRemoveAccount: (id: string) => void;
    onNext: () => void;
}) {
    const [name, setName] = useState("");
    const [type, setType] = useState<"personal" | "joint">("joint");

    const handleAdd = () => {
        if (!name.trim()) return;
        onAddAccount({
            id: "a" + Date.now(),
            name: name.trim(),
            type,
            icon: type === "joint" ? "👥" : "👤"
        });
        setName("");
    };

    return (
        <div className="flex flex-col h-full max-w-lg mx-auto w-full pt-12 pb-8 px-4">

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                <h2 className="text-[28px] font-bold tracking-tight text-foreground">Vos comptes</h2>
                <p className="text-[15px] text-muted-foreground mt-2">Définissez les comptes depuis lesquels les dépenses seront prélevées.</p>
            </motion.div>

            {/* Ajout Inset Style */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden divide-y divide-border mb-8">

                {/* Toggle Account Type */}
                <div className="p-4 bg-secondary/30">
                    <div className="flex p-1 bg-secondary rounded-[10px] w-full">
                        <button
                            onClick={() => setType('joint')}
                            className={`flex-1 py-1.5 text-[14px] font-medium rounded-[8px] transition-all ${type === 'joint' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                        >
                            Compte Commun
                        </button>
                        <button
                            onClick={() => setType('personal')}
                            className={`flex-1 py-1.5 text-[14px] font-medium rounded-[8px] transition-all ${type === 'personal' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                        >
                            Compte Perso
                        </button>
                    </div>
                </div>

                <div className="flex items-center px-4 py-3.5">
                    <span className="w-24 text-[16px] text-foreground font-medium">Libellé</span>
                    <input
                        type="text"
                        placeholder={type === "joint" ? "Ex: Boursorama Commun" : "Ex: Revolut Perso"}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[16px] text-foreground placeholder:text-muted-foreground/50"
                    />
                </div>

                <button
                    onClick={handleAdd}
                    disabled={!name.trim()}
                    className="w-full flex items-center justify-center gap-2 py-4 text-[16px] font-semibold text-primary disabled:opacity-30 disabled:font-normal active-press hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Ajouter ce compte
                </button>
            </motion.div>

            {/* Liste */}
            {accounts.length > 0 && (
                <div className="flex-1 overflow-y-auto no-scrollbar -mx-4 px-4 pb-4">
                    <h3 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide">Comptes enregistrés</h3>
                    <div className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden divide-y divide-border">
                        {accounts.map((a) => (
                            <motion.div key={a.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-4 px-4 py-3">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-[18px] shrink-0">
                                    {a.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[16px] font-semibold text-foreground truncate">{a.name}</p>
                                    <p className="text-[13px] text-muted-foreground capitalize">{a.type === 'joint' ? 'Commun' : 'Personnel'}</p>
                                </div>
                                <button
                                    onClick={() => onRemoveAccount(a.id)}
                                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-destructive active-press shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bouton Suivant Fixé en Bas */}
            <div className="mt-auto pt-4">
                <button
                    onClick={onNext}
                    disabled={accounts.length < 1}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-semibold text-[17px] rounded-[16px] active-press diffusion-shadow disabled:opacity-50"
                >
                    Continuer <ArrowRight className="w-5 h-5" />
                </button>
            </div>

        </div>
    );
}
