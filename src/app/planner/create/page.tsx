'use client';

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCreateTravelPlan } from '@/hooks/useTravelPlanQueries';
import { IChecklistItem } from '@/types/types';
import { BanknotesIcon, CalendarIcon, MapPinIcon, PencilIcon } from '@heroicons/react/16/solid';
import CreateTravelPlanSkeleton from '@/components/skeleton/CreateTravelPlanSkeleton';

type FormData = {
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
  budget: number;
  checklist: IChecklistItem[];
  description: string;
};

export default function CreateTravelPlan() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const createTravelPlan = useCreateTravelPlan();

  // 인증 상태를 확인하고, 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const onSubmit = async (data: FormData) => {
    if (!session) {
      alert('로그인이 필요합니다.');
      return;
    }

    createTravelPlan.mutate(data, {
      onSuccess: () => {
        router.push('/planner');
        router.refresh();
      },
      onError: (error) => {
        console.error('Error:', error);
        alert('여행 계획 생성 중 오류가 발생했습니다.');
      }
    });
  };

  if (status === 'loading') {
    return <CreateTravelPlanSkeleton />
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">새 여행 계획 만들기</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">제목</label>
          <div className="relative">
            <PencilIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              data-cy="trip-title-input"
              id="title"
              {...register('title', { required: '제목을 입력해주세요.' })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="여행 제목을 입력하세요"
            />
          </div>
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-700">시작 날짜</label>
            <div className="relative">
              <CalendarIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                data-cy="trip-start-date"
                id="startDate"
                type="date"
                {...register('startDate', { required: '시작 날짜를 선택해주세요.' })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-700">종료 날짜</label>
            <div className="relative">
              <CalendarIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                data-cy="trip-end-date"
                id="endDate"
                type="date"
                {...register('endDate', { required: '종료 날짜를 선택해주세요.' })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="destination" className="block mb-2 text-sm font-medium text-gray-700">목적지</label>
          <div className="relative">
            <MapPinIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              data-cy="trip-destination-input"
              id="destination"
              {...register('destination', { required: '목적지를 입력해주세요.' })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="여행 목적지를 입력하세요"
            />
          </div>
          {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>}
        </div>

        <div>
          <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-700">총 예산</label>
          <div className="relative">
            <BanknotesIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              data-cy="trip-budget-input"
              id="budget"
              type="number"
              step="10000"
              {...register('budget', { 
                required: '총 예산을 입력해주세요',
                min: { value: 0, message: '예산은 0 이상이어야 합니다.' }
              })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">설명</label>
          <textarea
            data-cy="trip-description-input"
            id="description"
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="여행에 대한 간단한 설명을 입력하세요"
          />
        </div>

        <button 
          data-cy="create-trip-button" 
          type="submit" 
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          여행 계획 만들기
        </button>
      </form>
    </div>
  );
}