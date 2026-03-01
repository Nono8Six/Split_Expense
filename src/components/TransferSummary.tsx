import { User, Expense, Account } from "../types";
import { ArrowRight, Wallet, Users, LayoutDashboard, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TransferSummaryProps {
  users: User[];
  expenses: Expense[];
  accounts: Account[];
}

export function TransferSummary({ users, expenses, accounts }: TransferSummaryProps) {
  if (users.length === 0) return null;

  const userTotals = users.map(u => ({
    userId: u.id,
    name: u.name,
    avatar: u.avatar,
    color: u.color,
    salary: u.salary,
    paid: 0,
    owed: 0
  }));

  const totalSalary = users.reduce((sum, u) => sum + u.salary, 0);

  // Pro-rata Calculation
  expenses.forEach(e => {
    if (e.splits) {
      e.splits.forEach(split => {
        const u = userTotals.find(ut => ut.userId === split.userId);
        if (u) u.paid += split.amount;
      });
    } else {
      // Si on n'a pas de répartition (ex: ancienne donnée ou default), le proprio du compte paie
      const account = accounts.find(a => a.id === e.accountId);
      if (account && account.ownerId) {
        const u = userTotals.find(ut => ut.userId === account.ownerId);
        if (u) u.paid += e.amount;
      }
    }

    userTotals.forEach(u => {
      const share = totalSalary > 0 ? (u.salary / totalSalary) * e.amount : e.amount / users.length;
      u.owed += share;
    });
  });

  const balances = userTotals.map(u => ({
    ...u,
    balance: u.paid - u.owed
  }));

  const debtors = balances.filter(u => u.balance < -0.01).sort((a, b) => a.balance - b.balance);
  const creditors = balances.filter(u => u.balance > 0.01).sort((a, b) => b.balance - a.balance);

  const transfers: { from: string; to: string; amount: number; fromUser: any; toUser: any }[] = [];

  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

    if (amount > 0.01) {
      transfers.push({
        from: debtor.name,
        fromUser: debtor,
        to: creditor.name,
        toUser: creditor,
        amount
      });
      debtor.balance += amount;
      creditor.balance -= amount;
    }

    if (Math.abs(debtor.balance) < 0.01) d++;
    if (creditor.balance < 0.01) c++;
  }

  return (
    <div className="space-y-6 md:space-y-8">

      {/* Balances Section */}
      <div>
        <h2 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide">État des soldes</h2>
        <div className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden">
          <div className="flex flex-col divide-y divide-border">
            {balances.map(b => (
              <div key={b.userId} className="flex items-center gap-4 px-4 py-3.5">
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarImage src={b.avatar || ""} className="object-cover" />
                  <AvatarFallback style={{ backgroundColor: b.color }} className="text-white text-xs">{b.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-semibold text-foreground truncate">{b.name}</p>
                  <p className="text-[13px] text-muted-foreground">Revenu de base : {b.salary} €</p>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-[16px] font-bold ${b.balance >= 0 ? "text-primary" : "text-destructive"}`}>
                    {b.balance >= 0 ? "+" : ""}{b.balance.toFixed(2)} €
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5 whitespace-nowrap">
                    A payé {b.paid.toFixed(0)} €
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transfers Section */}
      <div>
        <h2 className="text-[14px] font-medium uppercase text-muted-foreground ml-4 mb-2 tracking-wide">Règlements requis</h2>
        <div className="bg-card diffusion-shadow rounded-[20px] border border-border overflow-hidden">
          {transfers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-[15px]">Tout le monde est à jour</div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {transfers.map((t, idx) => (
                <div key={idx} className="flex items-center gap-4 px-4 py-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarImage src={t.fromUser.avatar || ""} className="object-cover" />
                      <AvatarFallback style={{ backgroundColor: t.fromUser.color }} className="text-white text-[10px]">{t.from.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarImage src={t.toUser.avatar || ""} className="object-cover" />
                      <AvatarFallback style={{ backgroundColor: t.toUser.color }} className="text-white text-[10px]">{t.to.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[16px] font-bold text-foreground">{t.amount.toFixed(2)} €</p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{t.from} vers {t.to}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
