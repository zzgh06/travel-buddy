/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TravelPlan } from '@/types/types';
import SearchBar from './Searchbar';
import { ArrowRightCircleIcon, CalendarDateRangeIcon, MapIcon, PlusCircleIcon } from '@heroicons/react/16/solid';


export default function TravelPlanList({ initialPlans }: { initialPlans: TravelPlan[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [filteredPlans, setFilteredPlans] = useState(initialPlans);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchTerm: string) => {
    setIsSearching(searchTerm.length > 0)
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
      <div data-cy="trip-list" className="mt-8 space-y-6">
        {plans.length === 0 ? (
          <div className='w-full shadow rounded-lg border border-gray-200'>
            <div className="text-center py-12">
              <h3 className="mt-2 text-lg font-semibold text-gray-900">여행 계획 없음</h3>
              <p className="mt-1 text-sm text-gray-500">새로운 여행 계획을 만들어 시작하세요.</p>
              <div className="mt-6">
                <Link
                  href="/planner/create"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  data-cy="create-new-trip-button"
                >
                  <PlusCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                  새 여행 계획 만들기
                </Link>
              </div>
            </div>
          </div>
        ) : isSearching && filteredPlans.length === 0 ? (
          <div className='w-full py-6 shadow rounded-lg text-center border border-gray-200'>
            <p className='text-xl font-semibold text-gray-500 pb-1'>검색된 결과가 없습니다 😅</p>
            <span className='text-sm'>다른 검색어를 입력해주세요</span>
          </div>
        ) : (
          (isSearching ? filteredPlans : plans).map((plan) => (
            <div data-cy="trip-item" key={plan._id} className='bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out'>
              <div className='flex justify-between items-center mb-4'>
                <h2 data-cy="trip-title" className='text-2xl font-semibold text-gray-800'>{plan.title}</h2>
                <span className='px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full'>
                  {new Date(plan.startDate) > new Date() ? "예정된 여행" : "지난 여행"}
                </span>
              </div>
              <div className='flex items-center text-gray-600 mb-2'>
                <MapIcon className='w-5 h-5 mr-2' />
                <span data-cy="trip-destination">{plan.destination}</span>
              </div>
              <div className='flex items-center text-gray-600 mb-4'>
                <CalendarDateRangeIcon className='w-5 h-5 mr-2' />
                <span>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</span>
              </div>
              <Link
                href={`/planner/${plan._id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
                data-cy="view-trip-details"
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
