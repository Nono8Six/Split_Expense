import React, { useState } from "react";
import { X, Plus, Trash2, Camera } from "lucide-react";
import { User, Account } from "../types";
import { cn } from "../lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  setUsers: (users: User[]) => void;
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  users,
  setUsers,
  accounts,
  setAccounts,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"PROFILES" | "ACCOUNTS">("PROFILES");

  if (!isOpen) return null;

  const handleUserChange = (id: string, field: keyof User, value: any) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  const handleAvatarUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleUserChange(id, "avatar", url);
    }
  };

  const handleAccountChange = (id: string, field: keyof Account, value: any) => {
    setAccounts(accounts.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const addAccount = () => {
    const newAccount: Account = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Nouveau compte",
      type: "PERSONAL",
      ownerId: users[0]?.id,
    };
    setAccounts([...accounts, newAccount]);
  };

  const removeAccount = (id: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Paramètres</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-100 shrink-0 px-6">
          <button
            className={cn(
              "px-6 py-4 text-sm font-medium border-b-2 transition-colors",
              activeTab === "PROFILES"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab("PROFILES")}
          >
            Profils & Salaires
          </button>
          <button
            className={cn(
              "px-6 py-4 text-sm font-medium border-b-2 transition-colors",
              activeTab === "ACCOUNTS"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab("ACCOUNTS")}
          >
            Comptes Bancaires
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "PROFILES" && (
            <div className="space-y-8">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-50 p-6 rounded-3xl space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-medium overflow-hidden shrink-0 shadow-sm"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                        <Camera className="w-6 h-6" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAvatarUpload(user.id, e)}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => handleUserChange(user.id, "name", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Salaire net (€)</label>
                          <input
                            type="number"
                            value={user.salary}
                            onChange={(e) => handleUserChange(user.id, "salary", parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                          <div className="flex items-center gap-2 h-11">
                            <input
                              type="color"
                              value={user.color}
                              onChange={(e) => handleUserChange(user.id, "color", e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                            />
                            <span className="text-sm text-gray-500 uppercase">{user.color}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "ACCOUNTS" && (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={account.name}
                      onChange={(e) => handleAccountChange(account.id, "name", e.target.value)}
                      placeholder="Nom du compte"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="w-40">
                    <select
                      value={account.type}
                      onChange={(e) => handleAccountChange(account.id, "type", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none"
                    >
                      <option value="PERSONAL">Personnel</option>
                      <option value="JOINT">Commun</option>
                    </select>
                  </div>
                  {account.type === "PERSONAL" && (
                    <div className="w-40">
                      <select
                        value={account.ownerId || ""}
                        onChange={(e) => handleAccountChange(account.id, "ownerId", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none"
                      >
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={() => removeAccount(account.id)}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addAccount}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-medium hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter un compte
              </button>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-black text-white rounded-2xl py-4 font-medium hover:bg-gray-900 transition-colors shadow-lg shadow-black/10"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}
