/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TravelPlan } from '@/types/types';
import SearchBar from './Searchbar';
import { ArrowRightCircleIcon, CalendarDateRangeIcon, MapIcon } from '@heroicons/react/16/solid';


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
    <div className='max-w-[900px] mx-auto mt-4 p-4'>
      <SearchBar onSearch={handleSearch} />
      <div className="mt-8 space-y-6">
        {filteredPlans.length === 0 ? (
          <p className='text-center text-gray-500 py-8'>검색 결과가 없습니다.</p>
        ) : (
          filteredPlans.map((plan) => (
            <div key={plan._id} className="bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{plan.title}</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {new Date(plan.startDate) > new Date() ? '예정된 여행' : '지난 여행'}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <MapIcon className="w-5 h-5 mr-2" />
                <span>{plan.destination}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <CalendarDateRangeIcon className="w-5 h-5 mr-2" />
                <span>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</span>
              </div>
              <Link
                href={`/planner/${plan._id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
              >
                <ArrowRightCircleIcon className="w-5 h-5 mr-2" />
                자세히 보기
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
