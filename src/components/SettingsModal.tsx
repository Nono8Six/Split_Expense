import React, { useState } from "react";
import { X, Camera, Plus, Trash2 } from "lucide-react";
import { User, Account } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteUser } from "../services/api/users/delete-user";
import { createUser } from "../services/api/users/create-user";
import { updateUser as apiUpdateUser } from "../services/api/users/update-user";
import { createAccount } from "../services/api/accounts/create-account";
import { deleteAccount } from "../services/api/accounts/delete-account";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  accounts: Account[];
}

export function SettingsModal({ isOpen, onClose, users, accounts }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"users" | "accounts" | "system">("users");

  const handleUpdateSalary = async (user: User, salaryStr: string) => {
    const salary = parseFloat(salaryStr);
    if (!isNaN(salary)) {
      await apiUpdateUser({ ...user, salary });
    }
  };

  const handleUpdateColor = async (user: User, color: string) => {
    await apiUpdateUser({ ...user, color });
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
  };

  const handleAddUser = async () => {
    const newUser: User = {
      id: "u" + Date.now().toString(),
      name: "Nouvel Utilisateur",
      avatar: "",
      salary: 2000,
      color: "#007AFF"
    };
    await createUser(newUser);
  };

  const handleAddAccount = async () => {
    const newAcct: Account = {
      id: "a" + Date.now().toString(),
      name: "Nouveau Compte",
      type: "joint",
      icon: "💳"
    };
    await createAccount(newAcct);
  };

  const handleDeleteAccount = async (id: string) => {
    await deleteAccount(id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20"
          onClick={onClose}
        />

        {/* iOS Settings Sheet (Right side sliding on desktop, full screen sliding bottom on mobile) */}
        <motion.div
          initial={{ x: "100%", y: 0 }}
          animate={{ x: 0, y: 0 }}
          exit={{ x: "100%", y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full md:w-[480px] bg-background border-l border-border shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="glass flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 z-10 shrink-0">
            <h1 className="text-[28px] font-bold tracking-tight">Réglages</h1>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center active-press">
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 no-scrollbar">

            {/* Custom Segmented Control */}
            <div className="flex p-1 bg-secondary rounded-[12px]">
              {(["users", "accounts", "system"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-[14px] font-medium rounded-[10px] capitalize transition-all ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                >
                  {tab === "users" ? "Membres" : tab === "accounts" ? "Comptes" : "Général"}
                </button>
              ))}
            </div>

            {/* Inset Grouped List - Users */}
            {activeTab === "users" && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                {users.map((user) => (
                  <div key={user.id}>
                    <h2 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide text-left">{user.name}</h2>
                    <div className="bg-card rounded-[16px] border border-border overflow-hidden divide-y divide-border diffusion-shadow">

                      {/* Avatar Row */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[16px] text-foreground">Photo de profil</span>
                        <Avatar className="w-12 h-12 shadow-sm border border-border cursor-pointer">
                          <AvatarImage src={user.avatar} className="object-cover" />
                          <AvatarFallback style={{ backgroundColor: user.color }} className="text-white text-md font-medium">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Name input */}
                      <div className="flex items-center px-4 py-3">
                        <span className="w-24 text-[16px] text-foreground">Prénom</span>
                        <input
                          type="text"
                          defaultValue={user.name}
                          onBlur={e => apiUpdateUser({ ...user, name: e.target.value })}
                          className="flex-1 bg-transparent border-none outline-none text-[16px] text-right text-muted-foreground placeholder:text-muted-foreground/50"
                        />
                      </div>

                      {/* Revenu input */}
                      <div className="flex items-center px-4 py-3">
                        <span className="w-24 text-[16px] text-foreground">Revenu net</span>
                        <input
                          type="number"
                          defaultValue={user.salary}
                          onBlur={e => handleUpdateSalary(user, e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-[16px] text-right text-muted-foreground placeholder:text-muted-foreground/50"
                        />
                      </div>

                      {/* Color Picker exact Apple colors */}
                      <div className="px-4 py-3">
                        <span className="text-[16px] text-foreground mb-3 block">Couleur d'avatar</span>
                        <div className="flex gap-3 mt-2">
                          {["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#5856D6"].map(c => (
                            <button
                              key={c}
                              onClick={() => handleUpdateColor(user, c)}
                              className={`w-8 h-8 rounded-full border-2 ${user.color === c ? 'border-foreground scale-110 shadow-sm' : 'border-transparent'} transition-transform`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Delete */}
                      <button onClick={() => handleDeleteUser(user.id)} className="w-full text-left px-4 py-3 text-[16px] text-destructive hover:bg-destructive/5 active:bg-destructive/10 transition-colors">
                        Supprimer le membre
                      </button>
                    </div>
                  </div>
                ))}

                <button onClick={handleAddUser} className="w-full flex items-center justify-center gap-2 py-4 bg-card border border-border rounded-[16px] text-primary font-medium hover:bg-black/5 dark:hover:bg-white/5 active-press diffusion-shadow">
                  <Plus className="w-5 h-5" />
                  Ajouter un membre
                </button>
              </motion.div>
            )}

            {/* Inset Grouped List - Accounts */}
            {activeTab === "accounts" && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div>
                  <h2 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide text-left">Comptes configurés</h2>
                  <div className="bg-card rounded-[16px] border border-border overflow-hidden divide-y divide-border diffusion-shadow">
                    {accounts.map(acc => (
                      <div key={acc.id} className="p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            defaultValue={acc.name}
                            onBlur={e => createAccount({ ...acc, name: e.target.value })}
                            className="bg-transparent border-none outline-none text-[17px] font-semibold text-foreground placeholder:text-muted-foreground/50"
                          />
                          <button onClick={() => handleDeleteAccount(acc.id)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-destructive active-press">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex p-1 bg-secondary/50 rounded-[8px] w-full">
                          <button
                            onClick={() => createAccount({ ...acc, type: 'joint' })}
                            className={`flex-1 py-1 text-[13px] font-medium rounded-[6px] transition-all ${acc.type === 'joint' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'}`}
                          >Joint</button>
                          <button
                            onClick={() => createAccount({ ...acc, type: 'personal' })}
                            className={`flex-1 py-1 text-[13px] font-medium rounded-[6px] transition-all ${acc.type === 'personal' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'}`}
                          >Personnel</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleAddAccount} className="w-full flex items-center justify-center gap-2 py-4 bg-card border border-border rounded-[16px] text-primary font-medium hover:bg-black/5 dark:hover:bg-white/5 active-press diffusion-shadow">
                  <Plus className="w-5 h-5" />
                  Ajouter un compte
                </button>
              </motion.div>
            )}

            {/* Inset Grouped List - System */}
            {activeTab === "system" && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div>
                  <h2 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide text-left">Application</h2>
                  <div className="bg-card rounded-[16px] border border-border overflow-hidden divide-y divide-border diffusion-shadow">
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-[16px] text-foreground">Version</span>
                      <span className="text-[16px] text-muted-foreground">Apple-Style Edition 2.0</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-[16px] text-foreground">Données locales</span>
                      <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-[16px] text-destructive">Effacer tout</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
