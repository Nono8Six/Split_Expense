import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { User, Expense, SplitType, Account } from "../types";
import { cn } from "../lib/utils";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  accounts: Account[];
  onAdd: (expense: Expense) => void;
  onUpdate?: (expense: Expense) => void;
  editingExpense?: Expense;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  users,
  accounts,
  onAdd,
  onUpdate,
  editingExpense,
}: AddExpenseModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [accountId, setAccountId] = useState("");
  const [splitType, setSplitType] = useState<SplitType>("EQUAL");
  const [shares, setShares] = useState<Record<string, number>>({});
  const [category, setCategory] = useState("Autre");
  const [involvedUsers, setInvolvedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (editingExpense) {
      setName(editingExpense.name);
      setAmount(editingExpense.amount.toString());
      setDayOfMonth(editingExpense.dayOfMonth.toString());
      setAccountId(editingExpense.accountId);
      setSplitType(editingExpense.splitType);
      setShares(editingExpense.shares);
      setCategory(editingExpense.category);
      setInvolvedUsers(editingExpense.involvedUsers || users.map(u => u.id));
    } else {
      setName("");
      setAmount("");
      setDayOfMonth("1");
      setAccountId(accounts[0]?.id || "");
      setSplitType("EQUAL");
      setShares({});
      setCategory("Autre");
      setInvolvedUsers(users.map(u => u.id));
    }
  }, [editingExpense, accounts, isOpen, users]);

  if (!isOpen) return null;

  const toggleInvolvedUser = (userId: string) => {
    setInvolvedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !name || !accountId || involvedUsers.length === 0) return;

    // Calculate shares based on splitType
    let finalShares = { ...shares };
    
    // Reset shares for users not involved
    users.forEach(u => {
      if (!involvedUsers.includes(u.id)) {
        finalShares[u.id] = 0;
      }
    });

    if (splitType === "EQUAL") {
      const shareAmount = numAmount / involvedUsers.length;
      involvedUsers.forEach((uid) => {
        finalShares[uid] = shareAmount;
      });
    } else if (splitType === "PROPORTIONAL") {
      const involved = users.filter(u => involvedUsers.includes(u.id));
      const totalSalary = involved.reduce((sum, u) => sum + u.salary, 0);
      involved.forEach((u) => {
        finalShares[u.id] = (u.salary / totalSalary) * numAmount;
      });
    } else if (splitType === "EXACT") {
      // Keep existing shares, but maybe validate they sum to amount?
    }

    const expenseData: Expense = {
      id: editingExpense
        ? editingExpense.id
        : Math.random().toString(36).substr(2, 9),
      name,
      amount: numAmount,
      dayOfMonth: parseInt(dayOfMonth, 10),
      accountId,
      splitType,
      shares: finalShares,
      involvedUsers,
      category,
    };

    if (editingExpense && onUpdate) {
      onUpdate(expenseData);
    } else {
      onAdd(expenseData);
    }

    onClose();
  };

  // Group accounts by type for the select dropdown
  const personalAccounts = accounts.filter(a => a.type === "PERSONAL");
  const jointAccounts = accounts.filter(a => a.type === "JOINT");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingExpense ? "Modifier la dépense" : "Nouvelle dépense"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom (Entreprise)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Netflix, Loyer, etc."
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jour du mois
              </label>
              <input
                type="number"
                required
                min="1"
                max="31"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              type="text"
              list="categories"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Logement, Logiciel, etc."
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            />
            <datalist id="categories">
              <option value="Logement" />
              <option value="Logiciel" />
              <option value="Alimentation" />
              <option value="Transport" />
              <option value="Loisirs" />
              <option value="Santé" />
              <option value="Autre" />
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pour qui ?
            </label>
            <div className="flex gap-2">
              {users.map(user => {
                const isInvolved = involvedUsers.includes(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleInvolvedUser(user.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium transition-all border",
                      isInvolved 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                        : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white overflow-hidden"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    {user.name}
                    {isInvolved && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payé depuis le compte
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none appearance-none"
            >
              {jointAccounts.length > 0 && (
                <optgroup label="Comptes Communs">
                  {jointAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </optgroup>
              )}
              {personalAccounts.length > 0 && (
                <optgroup label="Comptes Personnels">
                  {personalAccounts.map(acc => {
                    const owner = users.find(u => u.id === acc.ownerId);
                    return (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} {owner ? `(${owner.name})` : ''}
                      </option>
                    );
                  })}
                </optgroup>
              )}
            </select>
          </div>

          {involvedUsers.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Répartition
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSplitType("EQUAL")}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                    splitType === "EQUAL"
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  50 / 50
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType("PROPORTIONAL")}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                    splitType === "PROPORTIONAL"
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  Au prorata
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType("EXACT")}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                    splitType === "EXACT"
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  Personnalisé
                </button>
              </div>
            </div>
          )}

          {splitType === "EXACT" && involvedUsers.length > 1 && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-2xl">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Montants exacts
              </p>
              {users.filter(u => involvedUsers.includes(u.id)).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">{user.name}</span>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      €
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={shares[user.id] || ""}
                      onChange={(e) =>
                        setShares({
                          ...shares,
                          [user.id]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={involvedUsers.length === 0}
            className="w-full py-4 bg-black text-white rounded-2xl font-medium text-lg shadow-lg hover:bg-gray-900 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingExpense ? "Enregistrer" : "Ajouter la dépense"}
          </button>
        </form>
      </div>
    </div>
  );
}
