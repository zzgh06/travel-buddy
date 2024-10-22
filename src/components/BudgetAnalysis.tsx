import React from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { useTravelPlan } from '@/hooks/useTravelPlan';

interface BudgetAnalysisProps {
  travelPlanId: string;
}

export default function BudgetAnalysis({ travelPlanId }: BudgetAnalysisProps) {
  const { data: travelPlan } = useTravelPlan(travelPlanId);
  const { categoryExpenses } = useTravelStore();


  if (!travelPlan) return null;

  const totalBudget = travelPlan.budget || 0;

  const categories = [
    { name: '숙박', value: categoryExpenses.accommodation, color: 'bg-blue-500' },
    { name: '식비', value: categoryExpenses.food, color: 'bg-green-500' },
    { name: '교통비', value: categoryExpenses.transportation, color: 'bg-yellow-500' },
    { name: '엔터테인먼트', value: categoryExpenses.entertainment, color: 'bg-purple-500' },
    { name: '기타', value: categoryExpenses.other, color: 'bg-gray-500' },
  ];

  return (
    <div data-cy="budget-analysis" className="bg-white py-3 px-4 rounded-lg border border-gray-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">예산 분석</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div data-cy="category-budget" key={category.name} className="bg-gray-50 p-2 rounded-lg shadow">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-gray-800">{category.name}</h3>
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
            </div>
            <div className="text-lg font-bold mb-2 text-gray-900">
              {category.value.toLocaleString()} 원
            </div>
            <div className="mb-2 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`${category.color} rounded-full h-full`}
                style={{ width: `${totalBudget ? (category.value / totalBudget) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              전체 예산의 {totalBudget ? ((category.value / totalBudget) * 100).toFixed(1) : 0}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
