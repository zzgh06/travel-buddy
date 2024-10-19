import React from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { useTravelPlan } from '@/hooks/useTravelPlanQueries';

interface BudgetAnalysisProps {
  travelPlanId: string;
}

export default function BudgetAnalysis({ travelPlanId }: BudgetAnalysisProps) {
  const { data: travelPlan, isLoading, error } = useTravelPlan(travelPlanId);
  const { categoryExpenses } = useTravelStore();

  if (isLoading) return <div>로딩 중...</div>;

  if (error) return <div>에러 발생: {error.message}</div>;

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
    <div className="mt-2">
      <h2 className="text-2xl font-bold mb-4">예산 분석</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.name} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">{category.name}</h3>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${category.color} mr-2`}></div>
              <span>{category.value.toLocaleString()} 원</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className={`${category.color} rounded-full h-2`}
                style={{ width: `${totalBudget ? (category.value / travelPlan.budget) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              전체 예산의 {totalBudget ? ((category.value / travelPlan.budget) * 100).toFixed(1) : 0}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
