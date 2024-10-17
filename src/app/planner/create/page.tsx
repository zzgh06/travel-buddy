'use client';

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type FormData = {
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
  description: string;
};

export default function CreateTravelPlan() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

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

    try {
      const response = await fetch('/api/travel-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/planner');
      } else {
        throw new Error('여행 계획 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('여행 계획 생성 중 오류가 발생했습니다.');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">새 여행 계획 만들기</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">제목</label>
          <input
            data-cy="trip-title-input"
            id="title"
            {...register('title', { required: '제목을 입력해주세요.' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="startDate" className="block mb-1">시작 날짜</label>
          <input
            data-cy="trip-start-date"
            id="startDate"
            type="date"
            {...register('startDate', { required: '시작 날짜를 선택해주세요.' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block mb-1">종료 날짜</label>
          <input
            data-cy="trip-end-date"
            id="endDate"
            type="date"
            {...register('endDate', { required: '종료 날짜를 선택해주세요.' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
        </div>

        <div>
          <label htmlFor="destination" className="block mb-1">목적지</label>
          <input
            data-cy="trip-destination-input"
            id="destination"
            {...register('destination', { required: '목적지를 입력해주세요.' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.destination && <p className="text-red-500">{errors.destination.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">설명</label>
          <textarea
            data-cy="trip-description-input"
            id="description"
            {...register('description')}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <button data-cy="create-trip-button" type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          여행 계획 만들기
        </button>
      </form>
    </div>
  );
}