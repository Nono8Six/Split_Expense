import React from 'react';
import { User, Expense, Account } from '../types';
import { ArrowRight } from 'lucide-react';

interface TransferSummaryProps {
  users: User[];
  expenses: Expense[];
  accounts: Account[];
}

export function TransferSummary({ users, expenses, accounts }: TransferSummaryProps) {
  // Calculate total salary
  const totalSalary = users.reduce((sum, u) => sum + u.salary, 0);

  // Calculate transfers needed
  // 1. To JOINT accounts
  // 2. Between users for PERSONAL accounts
  
  const jointAccounts = accounts.filter(a => a.type === 'JOINT');
  const personalAccounts = accounts.filter(a => a.type === 'PERSONAL');

  // Map: userId -> amount they need to transfer to joint account
  const transfersToJoint: Record<string, number> = {};
  users.forEach(u => transfersToJoint[u.id] = 0);

  // Map: userId -> userId -> amount owed
  const userToUserOwed: Record<string, Record<string, number>> = {};
  users.forEach(u1 => {
    userToUserOwed[u1.id] = {};
    users.forEach(u2 => {
      if (u1.id !== u2.id) userToUserOwed[u1.id][u2.id] = 0;
    });
  });

  expenses.forEach(expense => {
    const account = accounts.find(a => a.id === expense.accountId);
    if (!account) return;

    if (account.type === 'JOINT') {
      // Each user needs to transfer their share of this expense to the joint account
      users.forEach(u => {
        transfersToJoint[u.id] += (expense.shares[u.id] || 0);
      });
    } else if (account.type === 'PERSONAL' && account.ownerId) {
      // The owner paid for it. Other users owe the owner their share.
      users.forEach(u => {
        if (u.id !== account.ownerId) {
          userToUserOwed[u.id][account.ownerId] += (expense.shares[u.id] || 0);
        }
      });
    }
  });

  // Simplify user-to-user debts
  const netTransfers: { from: User; to: User; amount: number }[] = [];
  if (users.length === 2) {
    const u1 = users[0];
    const u2 = users[1];
    const u1OwesU2 = userToUserOwed[u1.id][u2.id];
    const u2OwesU1 = userToUserOwed[u2.id][u1.id];
    
    if (u1OwesU2 > u2OwesU1) {
      netTransfers.push({ from: u1, to: u2, amount: u1OwesU2 - u2OwesU1 });
    } else if (u2OwesU1 > u1OwesU2) {
      netTransfers.push({ from: u2, to: u1, amount: u2OwesU1 - u1OwesU2 });
    }
  }

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <h3 className="text-lg font-medium text-gray-900 mb-6 px-2">
        Virements du mois
      </h3>
      
      <div className="space-y-6">
        {/* Joint Account Transfers */}
        {jointAccounts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-2">
              Vers le compte commun
            </h4>
            {users.map(user => {
              const amount = transfersToJoint[user.id];
              if (amount <= 0) return null;
              return (
                <div key={`joint-${user.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm overflow-hidden"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <ArrowRight className="w-4 h-4" />
                    <span className="font-medium text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">
                      {amount.toFixed(2)} €
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* User to User Transfers */}
        {netTransfers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-2">
              Remboursements
            </h4>
            {netTransfers.map((transfer, idx) => (
              <div key={`net-${idx}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm overflow-hidden"
                    style={{ backgroundColor: transfer.from.color }}
                  >
                    {transfer.from.avatar ? (
                      <img src={transfer.from.avatar} alt={transfer.from.name} className="w-full h-full object-cover" />
                    ) : (
                      transfer.from.name.charAt(0)
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{transfer.from.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <ArrowRight className="w-4 h-4" />
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">
                      {transfer.amount.toFixed(2)} €
                    </span>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm overflow-hidden"
                      style={{ backgroundColor: transfer.to.color }}
                    >
                      {transfer.to.avatar ? (
                        <img src={transfer.to.avatar} alt={transfer.to.name} className="w-full h-full object-cover" />
                      ) : (
                        transfer.to.name.charAt(0)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {jointAccounts.length === 0 && netTransfers.length === 0 && transfersToJoint[users[0].id] === 0 && (
          <p className="text-center text-gray-400 py-4">Aucun virement nécessaire</p>
        )}

        {/* Salaries Info */}
        <div className="pt-4 mt-4 border-t border-gray-100 px-2 flex items-center justify-between text-sm text-gray-500">
          <span>Revenus totaux: <strong className="text-gray-900">{totalSalary.toFixed(0)} €</strong></span>
          <div className="flex gap-4">
            {users.map(u => (
              <span key={u.id}>{u.name}: <strong className="text-gray-900">{u.salary} €</strong></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
