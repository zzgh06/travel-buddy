'use client';

import { useState } from 'react';
import Link from 'next/link';

export type TravelPlan = {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
};

interface TravelPlanListProps {
  initialPlans: TravelPlan[];
}

export default function TravelPlanList({ initialPlans }: TravelPlanListProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [plans, setPlans] = useState(initialPlans);

  return (
    <div className="space-y-4">
      {plans.length === 0 ? (
        <p>아직 생성된 여행 계획이 없습니다.</p>
      ) : (
        plans.map((plan) => (
          <div key={plan._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{plan.title}</h2>
            <p>목적지: {plan.destination}</p>
            <p>기간: {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</p>
            <Link href={`/planner/${plan._id}`} className="text-blue-500 hover:underline">
              자세히 보기
            </Link>
          </div>
        ))
      )}
    </div>
  );
}