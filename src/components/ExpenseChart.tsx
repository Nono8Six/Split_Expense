import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '../types';

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = ['#4F46E5', '#E67E5A', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Aggregate expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Sort by value descending
  categoryData.sort((a, b) => b.value - a.value);

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="w-full bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 h-[300px] flex items-center justify-center">
        <p className="text-gray-400">Aucune dépense pour ce mois</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 px-2">
        Répartition par catégorie
      </h3>
      <div className="h-[250px] w-full relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-xl font-bold text-gray-900">{totalAmount.toFixed(0)} €</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `${value.toFixed(2)} €`}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-sm text-gray-600 font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
