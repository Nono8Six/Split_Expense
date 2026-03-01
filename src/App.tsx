import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, ArrowLeftRight, Settings2, Plus,
  ChevronRight, Sun, Moon, CreditCard, PieChart
} from "lucide-react";
import { User, Expense, Account } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TransferSummary } from "./components/TransferSummary";
import { AddExpenseModal } from "./components/AddExpenseModal";
import { SettingsModal } from "./components/SettingsModal";
import { ExpenseChart } from "./components/ExpenseChart";
import { Calendar } from "./components/Calendar";
import { OnboardingFlow } from "./components/onboarding/onboarding-flow";

import { fetchUsers } from "./services/api/users/fetch-users";
import { fetchAccounts } from "./services/api/accounts/fetch-accounts";
import { fetchExpenses } from "./services/api/expenses/fetch-expenses";
import { createExpense } from "./services/api/expenses/create-expense";
import { updateExpense as apiUpdateExpense } from "./services/api/expenses/update-expense";
import { deleteExpense as apiDeleteExpense } from "./services/api/expenses/delete-expense";

type View = "dashboard" | "transfers" | "settings";

const NAV_ITEMS = [
  { id: "dashboard" as View, label: "Aperçu", icon: LayoutDashboard },
  { id: "transfers" as View, label: "Virements", icon: ArrowLeftRight },
  { id: "settings" as View, label: "Réglages", icon: Settings2 },
];

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [view, setView] = useState<View>("dashboard");

  const { theme, setTheme } = useTheme();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [u, a, e] = await Promise.all([fetchUsers(), fetchAccounts(), fetchExpenses()]);
      setUsers(u); setAccounts(a); setExpenses(e);
      if (u.length === 0) setShowOnboarding(true);
    } catch (err) {
      console.error("Erreur de chargement", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddExpense = async (expense: Expense) => {
    const created = await createExpense(expense);
    setExpenses(prev => [...prev, created]);
  };

  const handleUpdateExpense = async (expense: Expense) => {
    const updated = await apiUpdateExpense(expense);
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleDeleteExpense = async (id: string) => {
    await apiDeleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const totalMonthly = expenses.reduce((s, e) => s + e.amount, 0);

  if (isLoading) return <LoadingScreen />;
  if (showOnboarding) return (
    <OnboardingFlow onComplete={async () => { setShowOnboarding(false); await loadData(); }} />
  );

  return (
    <div className="flex h-dvh bg-background text-foreground overflow-hidden">

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 border-r border-border bg-card">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold tracking-tight">Split</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => item.id === "settings" ? setIsSettingsOpen(true) : setView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors active-press",
                view === item.id && item.id !== "settings"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[15px] font-medium text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors active-press"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{theme === "dark" ? "Mode clair" : "Mode sombre"}</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Mobile Header glass */}
        <header className="md:hidden glass fixed top-0 left-0 right-0 z-30 pt-[max(env(safe-area-inset-top),1rem)] pb-3 px-5 flex items-center justify-between">
          <h1 className="text-[28px] font-bold tracking-tight">
            {view === "dashboard" ? "Aperçu" : "Virements"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center active-press"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex -space-x-2">
              {users.map((u, i) => (
                <Avatar key={u.id} className="w-9 h-9 ring-2 ring-background z-10" style={{ zIndex: 10 - i }}>
                  <AvatarImage src={u.avatar} className="object-cover" />
                  <AvatarFallback style={{ backgroundColor: u.color }} className="text-white text-xs font-semibold">{u.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-24 pb-28 md:pt-8 md:pb-8 px-4 md:px-8">
          <AnimatePresence mode="wait">
            {view === "dashboard" && (
              <DashboardView
                key="dashboard"
                users={users} accounts={accounts} expenses={expenses}
                totalMonthly={totalMonthly} currentDate={currentDate}
                onDateChange={setCurrentDate} onEditExpense={openEditModal} onDeleteExpense={handleDeleteExpense}
              />
            )}
            {view === "transfers" && (
              <TransfersView key="transfers" users={users} accounts={accounts} expenses={expenses} />
            )}
          </AnimatePresence>
        </main>

        {/* FAB */}
        <button
          onClick={() => { setEditingExpense(undefined); setIsModalOpen(true); }}
          className="fixed right-5 bottom-[max(calc(env(safe-area-inset-bottom)+5.5rem),6.5rem)] md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center diffusion-shadow hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden glass fixed bottom-0 left-0 right-0 z-30 pb-[max(env(safe-area-inset-bottom),1rem)] pt-2 flex justify-around">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => item.id === "settings" ? setIsSettingsOpen(true) : setView(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[64px] transition-colors active-press",
                view === item.id && item.id !== "settings" ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("w-6 h-6", view === item.id && item.id !== "settings" && "fill-primary/20")} strokeWidth={view === item.id && item.id !== "settings" ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users} accounts={accounts}
        onAdd={handleAddExpense} onUpdate={handleUpdateExpense}
        editingExpense={editingExpense}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => { setIsSettingsOpen(false); loadData(); }}
        users={users} accounts={accounts}
      />
    </div>
  );
}

/* ─── Dashboard View ─────────────────────────────────────────── */
interface DashboardViewProps {
  key?: string;
  users: User[]; accounts: Account[]; expenses: Expense[];
  totalMonthly: number; currentDate: Date;
  onDateChange: (d: Date) => void;
  onEditExpense: (e: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

function DashboardView({ users, accounts, expenses, totalMonthly, currentDate, onDateChange, onEditExpense, onDeleteExpense }: DashboardViewProps) {
  const sorted = [...expenses].sort((a, b) => a.dayOfMonth - b.dayOfMonth);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Hero Balances (Apple Style Large Typography) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-card diffusion-shadow rounded-[24px] p-5 border border-border">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <PieChart className="w-4 h-4" />
            <span className="text-[13px] font-semibold uppercase tracking-wider">Ce mois</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold tracking-tight">
            {totalMonthly.toFixed(0)} <span className="opacity-50">€</span>
          </p>
          <p className="text-[14px] text-muted-foreground mt-1">{expenses.length} transactions</p>
        </div>

        <div className="bg-card diffusion-shadow rounded-[24px] p-5 border border-border">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            <span className="text-[13px] font-semibold uppercase tracking-wider">Prochaine</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold tracking-tight">
            {sorted[0] ? sorted[0].amount.toFixed(0) : "0"} <span className="opacity-50">€</span>
          </p>
          <p className="text-[14px] text-muted-foreground mt-1 truncate">{sorted[0]?.name ?? "Aucune"}</p>
        </div>

        <div className="col-span-2 md:col-span-1 bg-card diffusion-shadow rounded-[24px] p-5 border border-border md:bg-primary md:text-primary-foreground md:border-transparent">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground md:text-primary-foreground/80">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[13px] font-semibold uppercase tracking-wider">Revenus</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold tracking-tight">
            {users.reduce((s, u) => s + u.salary, 0).toLocaleString("fr-FR")} <span className="opacity-60">€</span>
          </p>
          <p className="text-[14px] text-muted-foreground md:text-primary-foreground/80 mt-1">Par mois</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Calendar expenses={expenses} currentDate={currentDate} onDateChange={onDateChange} />
        <ExpenseChart expenses={expenses} />
      </div>

      {/* Inset Grouped List (iOS Style) */}
      <div>
        <h2 className="text-[20px] font-bold tracking-tight mb-3 ml-2">Transactions</h2>
        <div className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden">
          {expenses.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-[15px]">Aucune dépense</div>
          ) : (
            <div className="divide-y divide-border">
              {sorted.map(expense => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  accounts={accounts}
                  onClick={() => onEditExpense(expense)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Expense Row (iOS iOS list cell style) ──────────────────── */
function ExpenseRow({ expense, accounts, onClick }: { key?: string; expense: Expense; accounts: Account[]; onClick: () => void }) {
  const account = accounts.find(a => a.id === expense.accountId);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border overflow-hidden">
        <img
          src={`https://logo.clearbit.com/${expense.name.toLowerCase().replace(/\s+/g, '')}.com`}
          alt={expense.name}
          className="w-full h-full object-cover"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-semibold leading-tight text-foreground truncate">{expense.name}</p>
        <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{account?.name ?? "—"} · Le {expense.dayOfMonth}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <p className="text-[16px] font-bold text-foreground">{expense.amount.toFixed(2)} €</p>
        <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={2.5} />
      </div>
    </button>
  );
}

/* ─── Transfers View ─────────────────────────────────────────── */
function TransfersView({ users, accounts, expenses }: { key?: string; users: User[], accounts: Account[], expenses: Expense[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="max-w-2xl mx-auto md:pt-4"
    >
      <TransferSummary users={users} expenses={expenses} accounts={accounts} />
    </motion.div>
  );
}

/* ─── Loading ────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div className="min-h-dvh bg-background p-6 space-y-6">
      <Skeleton className="h-10 w-48 rounded-xl bg-secondary" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-[24px] bg-secondary" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[340px] rounded-[24px] bg-secondary" />
        <Skeleton className="h-[340px] rounded-[24px] bg-secondary" />
      </div>
    </div>
  );
}
