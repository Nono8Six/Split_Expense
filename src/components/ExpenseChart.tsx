import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Expense } from "../types";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

interface ExpenseChartProps {
  expenses: Expense[];
}

// Les couleurs suivront les CSS variables définies pour le thème (iOS palette)
// Les variables CSS pour l'app : --chart-1, --chart-2, etc. (RGB/Hex format handled locally or via HSL)
// On va injecter les classes directement ou utiliser CSS variables
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)"
];

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  if (expenses.length === 0) return null;

  // Grouper par catégorie simplifiée (par nom ici ou account)
  // On simule une logique par libellé simplifié pour Apple rings style
  const dataMap = expenses.reduce((acc, exp) => {
    const category = exp.name.split(" ")[0].substring(0, 15);
    acc[category] = (acc[category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(dataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card diffusion-shadow rounded-[24px] border border-border p-6 flex flex-col h-full min-h-[380px]">
      <h2 className="text-[14px] font-medium uppercase text-muted-foreground mb-4 tracking-wide">Répartition</h2>

      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <PieChart>
            <Pie
              data={data}
              innerRadius="75%"
              outerRadius="100%"
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
              cornerRadius={8}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass px-4 py-2 border border-border rounded-xl diffusion-shadow">
                      <p className="text-[13px] font-semibold text-foreground">{data.name}</p>
                      <p className="text-[15px] font-bold text-foreground mt-1">{data.value.toFixed(2)} €</p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: 'transparent' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Total au centre du donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest">Total</span>
          <span className="text-[28px] font-bold text-foreground mt-0.5">{total.toFixed(0)} €</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center">
        {data.slice(0, 4).map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-[13px] text-muted-foreground truncate max-w-[80px]">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
