import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Expense } from "../types";
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarProps {
  expenses: Expense[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function Calendar({ expenses, currentDate, onDateChange }: CalendarProps) {
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getDay(startOfMonth(currentDate));
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Monday = 0
  const totalCells = 42; // 6 rows of 7 days

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const renderIcon = (expense: Expense, offset: number = 0) => {
    const emoji = expense.category === "Logement" ? "🏠" : expense.category === "Logiciel" ? "💻" : expense.category === "Alimentation" ? "🛒" : "💳";
    return (
      <div
        className="absolute top-1/2 left-1/2 w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-sm overflow-hidden"
        style={{
          transform: `translate(calc(-50% + ${offset}px), -50%)`,
          zIndex: offset > 0 ? 10 : 5,
        }}
      >
        <img 
          src={`https://logo.clearbit.com/${expense.name.toLowerCase().replace(/\s+/g, '')}.com`}
          alt={expense.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <span className="hidden w-full h-full flex items-center justify-center text-xs">
          {emoji}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onDateChange(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-medium text-gray-900 capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <button 
            onClick={() => onDateChange(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500 font-medium">Total du mois</span>
          <p className="text-xl font-semibold text-gray-900">
            {totalAmount.toFixed(2)} €
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: totalCells }).map((_, index) => {
          const dayNumber = index - startingDayIndex + 1;
          const isDate = dayNumber > 0 && dayNumber <= daysInMonth;
          
          const dayExpenses = isDate
            ? expenses.filter((e) => e.dayOfMonth === dayNumber)
            : [];

          return (
            <div
              key={index}
              className={cn(
                "aspect-square rounded-2xl relative flex flex-col items-center justify-end pb-2 transition-colors",
                isDate ? "bg-gray-50/50 hover:bg-gray-100/80" : "bg-gray-50/30 opacity-50",
              )}
            >
              {dayExpenses.map((event, i) => {
                const offset = dayExpenses.length > 1 ? (i === 0 ? -6 : 6) : 0;
                return (
                  <React.Fragment key={event.id}>
                    {renderIcon(event, offset)}
                  </React.Fragment>
                );
              })}
              {isDate && (
                <span className="text-[10px] font-medium text-gray-400">
                  {dayNumber}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
