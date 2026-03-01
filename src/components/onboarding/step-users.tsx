import React, { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { User } from "../../types";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function StepUsers({
    users,
    onAddUser,
    onUpdateUser,
    onRemoveUser,
    onNext
}: {
    users: User[];
    onAddUser: (u: User) => void;
    onUpdateUser: (u: User) => void;
    onRemoveUser: (id: string) => void;
    onNext: () => void;
}) {
    const [name, setName] = useState("");
    const [salary, setSalary] = useState("2000");

    const colors = ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#5856D6"];

    const handleAdd = () => {
        if (!name.trim()) return;
        onAddUser({
            id: "u" + Date.now(),
            name: name.trim(),
            avatar: "",
            salary: parseFloat(salary) || 0,
            color: colors[users.length % colors.length] // Automatically assign iOS color
        });
        setName("");
        setSalary("2000");
    };

    return (
        <div className="flex flex-col h-full max-w-lg mx-auto w-full pt-12 pb-8 px-4">

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                <h2 className="text-[28px] font-bold tracking-tight text-foreground">Qui participe ?</h2>
                <p className="text-[15px] text-muted-foreground mt-2">Ajoutez les personnes du foyer et leurs revenus nets.</p>
            </motion.div>

            {/* Ajout (Form style) */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden divide-y divide-border mb-8">
                <div className="flex items-center px-4 py-3.5">
                    <span className="w-20 text-[16px] text-foreground font-medium">Prénom</span>
                    <input
                        type="text"
                        placeholder="Ex: Alice"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[16px] text-foreground placeholder:text-muted-foreground/50"
                    />
                </div>
                <div className="flex items-center px-4 py-3.5">
                    <span className="w-20 text-[16px] text-foreground font-medium">Revenu</span>
                    <input
                        type="number"
                        placeholder="2000"
                        value={salary}
                        onChange={e => setSalary(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[16px] text-foreground placeholder:text-muted-foreground/50"
                    />
                    <span className="text-[16px] text-muted-foreground ml-2">€</span>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={!name.trim()}
                    className="w-full flex items-center justify-center gap-2 py-4 text-[16px] font-semibold text-primary disabled:opacity-30 disabled:font-normal active-press hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Ajouter cette personne
                </button>
            </motion.div>

            {/* Liste des personnes ajoutées */}
            {users.length > 0 && (
                <div className="flex-1 overflow-y-auto no-scrollbar -mx-4 px-4 pb-4">
                    <h3 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide">Membres</h3>
                    <div className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden divide-y divide-border">
                        {users.map((u) => (
                            <motion.div key={u.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-4 px-4 py-3">
                                <Avatar className="w-10 h-10 border border-border flex-shrink-0">
                                    <AvatarFallback style={{ backgroundColor: u.color }} className="text-white font-medium text-[14px]">{u.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[16px] font-semibold text-foreground truncate">{u.name}</p>
                                    <p className="text-[13px] text-muted-foreground">{u.salary} €</p>
                                </div>
                                <button
                                    onClick={() => onRemoveUser(u.id)}
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
                    disabled={users.length < 1}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-semibold text-[17px] rounded-[16px] active-press diffusion-shadow disabled:opacity-50"
                >
                    Continuer <ArrowRight className="w-5 h-5" />
                </button>
            </div>

        </div>
    );
}
