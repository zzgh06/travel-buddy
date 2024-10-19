/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TravelPlan } from '@/types/types';
import SearchBar from './Searchbar';

export default function TravelPlanList({ initialPlans }: { initialPlans: TravelPlan[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [filteredPlans, setFilteredPlans] = useState(initialPlans);

  const handleSearch = (searchTerm: string) => {
    const filtered = plans.filter(plan => 
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlans(filtered);
  };

  useEffect(() => {
    setFilteredPlans(plans);
  }, [plans]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          filteredPlans.map((plan) => (
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
    </div>
  );
}
