import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Expense } from "../types";
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "motion/react";

interface CalendarProps {
  expenses: Expense[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function Calendar({ expenses, currentDate, onDateChange }: CalendarProps) {
  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getDay(startOfMonth(currentDate)); // 0 = Sunday
  const startOffset = startDay === 0 ? 6 : startDay - 1; // Ajuster pour Lundi = 0

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startOffset }, (_, i) => i);

  // Semaine typique
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const expensesByDay = expenses.reduce((acc, exp) => {
    acc[exp.dayOfMonth] = (acc[exp.dayOfMonth] || 0) + exp.amount;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="bg-card diffusion-shadow rounded-[24px] border border-border p-6 h-full min-h-[380px] flex flex-col select-none">

      {/* Header Month / Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-foreground capitalize tracking-tight">
          {format(currentDate, "MMMM yyyy", { locale: fr })}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDateChange(subMonths(currentDate, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 active-press transition-colors text-primary"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => onDateChange(addMonths(currentDate, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 active-press transition-colors text-primary"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Weekdays indicator */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 flex-1">
        {blanks.map(i => (
          <div key={`blank-${i}`} className="h-10 invisible" />
        ))}

        {days.map(day => {
          const hasExpense = !!expensesByDay[day];
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

          return (
            <div key={day} className="h-10 flex flex-col items-center justify-start relative">
              <span className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full text-[16px] font-medium transition-colors",
                isToday ? "bg-primary text-primary-foreground font-bold" : "text-foreground",
                "hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              )}>
                {day}
              </span>

              {/* Event Dots (Apple Style) */}
              {hasExpense && (
                <span className={cn(
                  "absolute bottom-0 w-1.5 h-1.5 rounded-full mt-1",
                  isToday ? "bg-primary-foreground/80" : "bg-primary"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
