/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Calendar } from "./components/Calendar";
import { TransferSummary } from "./components/TransferSummary";
import { AddExpenseModal } from "./components/AddExpenseModal";
import { SettingsModal } from "./components/SettingsModal";
import { ExpenseChart } from "./components/ExpenseChart";
import { Plus, Edit2, Trash2, Settings } from "lucide-react";
import { User, Expense, Account } from "./types";

const MOCK_USERS: User[] = [
  { id: "u1", name: "Alice", color: "#E67E5A", salary: 2500 },
  { id: "u2", name: "Bob", color: "#4F46E5", salary: 3500 },
];

const MOCK_ACCOUNTS: Account[] = [
  { id: "acc_joint", name: "Compte Commun", type: "JOINT" },
  { id: "acc_u1", name: "Compte Alice", type: "PERSONAL", ownerId: "u1" },
  { id: "acc_u2", name: "Compte Bob", type: "PERSONAL", ownerId: "u2" },
];

const MOCK_EXPENSES: Expense[] = [
  {
    id: "e1",
    name: "ChatGPT",
    amount: 20,
    dayOfMonth: 3,
    accountId: "acc_u1",
    splitType: "EQUAL",
    shares: { u1: 10, u2: 10 },
    involvedUsers: ["u1", "u2"],
    category: "Logiciel",
  },
  {
    id: "e2",
    name: "Service",
    amount: 45,
    dayOfMonth: 6,
    accountId: "acc_u2",
    splitType: "EQUAL",
    shares: { u1: 22.5, u2: 22.5 },
    involvedUsers: ["u1", "u2"],
    category: "Autre",
  },
  {
    id: "e3",
    name: "App 1",
    amount: 15,
    dayOfMonth: 10,
    accountId: "acc_u1",
    splitType: "EQUAL",
    shares: { u1: 7.5, u2: 7.5 },
    involvedUsers: ["u1", "u2"],
    category: "Logiciel",
  },
  {
    id: "e4",
    name: "App 2",
    amount: 12,
    dayOfMonth: 10,
    accountId: "acc_u2",
    splitType: "EQUAL",
    shares: { u1: 6, u2: 6 },
    involvedUsers: ["u1", "u2"],
    category: "Logiciel",
  },
  {
    id: "e5",
    name: "Vercel",
    amount: 20,
    dayOfMonth: 11,
    accountId: "acc_u1",
    splitType: "EQUAL",
    shares: { u1: 10, u2: 10 },
    involvedUsers: ["u1", "u2"],
    category: "Logiciel",
  },
  {
    id: "e6",
    name: "Service D",
    amount: 30,
    dayOfMonth: 14,
    accountId: "acc_u2",
    splitType: "EQUAL",
    shares: { u1: 15, u2: 15 },
    involvedUsers: ["u1", "u2"],
    category: "Autre",
  },
  {
    id: "e7",
    name: "Service 2",
    amount: 50,
    dayOfMonth: 14,
    accountId: "acc_u1",
    splitType: "EQUAL",
    shares: { u1: 25, u2: 25 },
    involvedUsers: ["u1", "u2"],
    category: "Autre",
  },
  {
    id: "e8",
    name: "Service K",
    amount: 18,
    dayOfMonth: 18,
    accountId: "acc_u2",
    splitType: "EQUAL",
    shares: { u1: 9, u2: 9 },
    involvedUsers: ["u1", "u2"],
    category: "Autre",
  },
  {
    id: "e9",
    name: "Stripe",
    amount: 29,
    dayOfMonth: 20,
    accountId: "acc_u1",
    splitType: "EQUAL",
    shares: { u1: 14.5, u2: 14.5 },
    involvedUsers: ["u1", "u2"],
    category: "Logiciel",
  },
  {
    id: "e10",
    name: "Figma",
    amount: 15,
    dayOfMonth: 22,
    accountId: "acc_u2",
    splitType: "EQUAL",
    shares: { u1: 7.5, u2: 7.5 },
    involvedUsers: ["u1", "u2"],
    category: "Logiciel",
  },
  {
    id: "e11",
    name: "Service 3",
    amount: 40,
    dayOfMonth: 24,
    accountId: "acc_u1",
    splitType: "EQUAL",
    shares: { u1: 20, u2: 20 },
    involvedUsers: ["u1", "u2"],
    category: "Autre",
  },
  {
    id: "e12",
    name: "Cube",
    amount: 25,
    dayOfMonth: 26,
    accountId: "acc_u2",
    splitType: "EQUAL",
    shares: { u1: 12.5, u2: 12.5 },
    involvedUsers: ["u1", "u2"],
    category: "Logiciel",
  },
  {
    id: "e13",
    name: "Loyer",
    amount: 1200,
    dayOfMonth: 1,
    accountId: "acc_joint",
    splitType: "PROPORTIONAL",
    shares: { u1: 500, u2: 700 }, // Proportional to 2500/3500
    involvedUsers: ["u1", "u2"],
    category: "Logement",
  },
];

export default function App() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const handleUpdateExpense = (expense: Expense) => {
    setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans pb-24">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 max-w-4xl mx-auto flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Aperçu
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Suivez vos dépenses communes</p>
        </div>
        <div className="flex items-center gap-2">
          {users.map(user => (
            <div 
              key={user.id}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm overflow-hidden shadow-sm border-2 border-white"
              style={{ backgroundColor: user.color, marginLeft: -8 }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
          ))}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 ml-2 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Calendar & Summary */}
          <div className="space-y-8">
            <Calendar 
              expenses={expenses} 
              currentDate={currentDate} 
              onDateChange={setCurrentDate} 
            />
            <TransferSummary users={users} expenses={expenses} accounts={accounts} />
          </div>

          {/* Right Column: Chart & List */}
          <div className="space-y-8">
            <ExpenseChart expenses={expenses} />

            {/* Expenses List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 px-2">
                Toutes les dépenses
              </h3>
              <div className="bg-white rounded-[32px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4 max-h-[600px] overflow-y-auto">
                {expenses.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">Aucune dépense pour ce mois</p>
                ) : (
                  expenses
                    .sort((a, b) => a.dayOfMonth - b.dayOfMonth)
                    .map((expense) => {
                      const account = accounts.find(a => a.id === expense.accountId);
                      const accountName = account ? account.name : "Inconnu";

                      return (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 group hover:bg-gray-50 rounded-2xl transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                              <img 
                                src={`https://logo.clearbit.com/${expense.name.toLowerCase().replace(/\s+/g, '')}.com`}
                                alt={expense.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <span className="text-2xl hidden flex items-center justify-center w-full h-full">
                                {expense.category === "Logement"
                                  ? "🏠"
                                  : expense.category === "Logiciel"
                                    ? "💻"
                                    : expense.category === "Alimentation"
                                      ? "🛒"
                                      : "💳"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{expense.name}</p>
                              <p className="text-sm text-gray-500">
                                Depuis {accountName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {expense.amount.toFixed(2)} €
                              </p>
                              <p className="text-sm text-gray-500">
                                Jour {expense.dayOfMonth}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => openEditModal(expense)}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={openAddModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        accounts={accounts}
        onAdd={handleAddExpense}
        onUpdate={handleUpdateExpense}
        editingExpense={editingExpense}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        users={users}
        setUsers={setUsers}
        accounts={accounts}
        setAccounts={setAccounts}
      />
    </div>
  );
}
