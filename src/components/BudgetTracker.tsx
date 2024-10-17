import React from 'react';

interface BudgetTrackerProps {
  budget: number;
  totalExpenses: number;
  remainingBudget: number;
}

const BudgetTracker = ({ budget, totalExpenses, remainingBudget }: BudgetTrackerProps) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">예산 추적</h2>
      <div className="mb-4">
        <p>총 예산: {budget.toLocaleString()} 원</p>
        <p>총 지출: {totalExpenses.toLocaleString()} 원</p>
        <p className={`font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          남은 예산: {remainingBudget.toLocaleString()} 원
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`h-2.5 rounded-full ${remainingBudget >= 0 ? 'bg-green-600' : 'bg-red-600'}`} 
          style={{ width: `${Math.min((totalExpenses / budget) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BudgetTracker;