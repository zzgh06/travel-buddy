'use client';

import React from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { useTravelPlan } from '@/hooks/useTravelPlan';

interface BudgetTrackerProps {
  travelPlanId: string;
}

export default function BudgetTracker({ travelPlanId }: BudgetTrackerProps) {
  const { totalExpenses, remainingBudget } = useTravelStore();
  const { data: travelPlan } = useTravelPlan(travelPlanId);
  if (!travelPlan) return null;

  const percentageSpent = travelPlan.budget ? (totalExpenses / travelPlan.budget) * 100 : 0;
  const isOverBudget = remainingBudget < 0;
  
  return (
    <div data-cy="budget-tracker" className="bg-white rounded border border-gray-300 px-8 py-6 mb-3">
      <h2 className="text-2xl font-bold mb-4">예산 추적</h2>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div data-cy="total-budget">
          <p className="text-gray-600">총 예산</p>
          <p className="text-2xl font-bold">{travelPlan.budget ? travelPlan.budget.toLocaleString() : 0} 원</p>
        </div>
        <div>
          <p className="text-gray-600">총 지출</p>
          <p className="text-2xl font-bold">{totalExpenses ? totalExpenses.toLocaleString() : 0} 원</p>
        </div>
        <div data-cy="remaining-budget" className="col-span-2">
          <p className="text-gray-600">남은 예산</p>
          <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {remainingBudget ? remainingBudget.toLocaleString() : 0} 원
          </p>
        </div>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-md font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              예산 사용률
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-semibold inline-block text-blue-600">
              {percentageSpent.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-blue-200">
          <div 
            style={{ width: `${Math.min(percentageSpent, 100)}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              isOverBudget ? 'bg-red-500' : 'bg-blue-500'
            }`}
          ></div>
        </div>
      </div>
      {isOverBudget && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">주의!</strong>
          <span className="block sm:inline"> 예산을 초과했습니다. 지출을 조정하세요.</span>
        </div>
      )}
    </div>
  );
};