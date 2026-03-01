import React, { useState, useEffect } from "react";
import { X, Calculator, CreditCard, ChevronRight } from "lucide-react";
import { User, Expense, Account } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  accounts: Account[];
  onAdd: (expense: Expense) => void;
  onUpdate?: (expense: Expense) => void;
  editingExpense?: Expense;
}

export function AddExpenseModal({ isOpen, onClose, users, accounts, onAdd, onUpdate, editingExpense }: AddExpenseModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState<number>(new Date().getDate());
  const [splits, setSplits] = useState<{ userId: string; amount: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (editingExpense) {
        setName(editingExpense.name);
        setAmount(editingExpense.amount.toString());
        setAccountId(editingExpense.accountId);
        setDayOfMonth(editingExpense.dayOfMonth);
        setSplits(editingExpense.splits || []);
      } else {
        setName("");
        setAmount("");
        setAccountId(accounts[0]?.id || "");
        setDayOfMonth(new Date().getDate());
        setSplits([]);
      }
    }
  }, [isOpen, editingExpense, accounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !accountId) return;

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const expense: Expense = {
      id: editingExpense?.id || "e" + Date.now().toString(),
      name,
      amount: parsedAmount,
      accountId,
      dayOfMonth,
      splits: splits.length > 0 ? splits : users.map(u => ({ userId: u.id, amount: parsedAmount / users.length }))
    };

    if (editingExpense && onUpdate) onUpdate(expense);
    else onAdd(expense);
    onClose();
  };

  const currentAccount = accounts.find(a => a.id === accountId);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Modal Apparition type Bottom Sheet iOS / Center Mac */}
        <motion.div
          initial={{ y: "100%", scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: "100%", scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full sm:max-w-[500px] h-[90vh] sm:h-auto sm:max-h-[90vh] bg-background sm:rounded-[32px] rounded-t-[32px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
        >
          {/* Header iOS Style */}
          <div className="glass flex items-center justify-between px-6 py-4 border-b border-border z-10 shrink-0">
            <button onClick={onClose} className="text-[17px] text-primary font-medium active:opacity-50">Annuler</button>
            <h1 className="text-[17px] font-semibold tracking-tight">{editingExpense ? "Modifier" : "Nouvelle dépense"}</h1>
            <button onClick={handleSubmit} disabled={!name || !amount} className="text-[17px] text-primary font-bold active:opacity-50 disabled:opacity-30 disabled:font-normal">
              {editingExpense ? "Enregistrer" : "Ajouter"}
            </button>
          </div>

          <form id="expense-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-6 space-y-8 bg-secondary/30 no-scrollbar">

            {/* Montant massif */}
            <div className="flex flex-col items-center justify-center py-4">
              <span className="text-[14px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Montant</span>
              <div className="flex items-baseline">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                  className="bg-transparent border-none outline-none text-[64px] font-bold tracking-tighter text-center text-foreground placeholder:text-muted-foreground/30 w-[200px]"
                  autoFocus
                />
                <span className="text-[32px] font-bold text-foreground mb-2">€</span>
              </div>
            </div>

            {/* Informations Principales - Inset Grouped */}
            <div>
              <div className="bg-card rounded-[16px] border border-border overflow-hidden divide-y divide-border diffusion-shadow">

                {/* Libellé */}
                <div className="flex items-center px-4 py-3.5">
                  <span className="w-[100px] text-[16px] text-foreground">Libellé</span>
                  <input
                    type="text"
                    placeholder="Ex: Loyer, Netflix..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[16px] text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Date */}
                <div className="flex items-center px-4 py-3.5">
                  <span className="w-[100px] text-[16px] text-foreground">Jour du mois</span>
                  <input
                    type="number"
                    min="1" max="31"
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
                    className="flex-1 bg-transparent border-none outline-none text-[16px] text-foreground text-right"
                  />
                </div>

                {/* Compte source */}
                <div className="flex items-center px-4 py-3.5 relative">
                  <span className="w-[100px] text-[16px] text-foreground">Compte</span>
                  <div className="flex-1 flex justify-end">
                    <select
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      className="appearance-none bg-transparent border-none outline-none text-[16px] text-muted-foreground pr-6 cursor-pointer rtl text-right"
                      dir="rtl"
                    >
                      {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>

            {/* Répartition (Advanced Inset) */}
            <div>
              <h2 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide text-left">Répartition spécifique</h2>
              <div className="bg-card rounded-[16px] border border-border overflow-hidden divide-y divide-border diffusion-shadow">
                {users.map((user) => {
                  const currentAmount = splits.find(s => s.userId === user.id)?.amount || (parseFloat(amount || "0") / users.length);
                  return (
                    <div key={user.id} className="flex items-center gap-4 px-4 py-3.5">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={user.avatar} className="object-cover" />
                        <AvatarFallback style={{ backgroundColor: user.color }} className="text-white text-xs">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-[16px] text-foreground flex-1 truncate">{user.name}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.01"
                          value={currentAmount.toFixed(2)}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const newSplits = splits.length > 0 ? [...splits] : users.map(u => ({ userId: u.id, amount: parseFloat(amount || "0") / users.length }));
                            const idx = newSplits.findIndex(s => s.userId === user.id);
                            if (idx >= 0) newSplits[idx].amount = val;
                            setSplits(newSplits);
                          }}
                          className="w-[80px] bg-transparent border-none outline-none text-[16px] text-right text-foreground bg-secondary/50 rounded-md px-2 py-1"
                        />
                        <span className="text-[16px] text-muted-foreground">€</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[13px] text-muted-foreground mt-2 ml-4">
                Si non modifiée, la dépense est divisée en parts égales.
              </p>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
