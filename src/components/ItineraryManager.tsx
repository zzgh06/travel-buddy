'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Itinerary, TravelPlan } from '@/types/types';
import { useCreateItinerary, useDeleteItinerary, useItineraries, useUpdateItinerary } from '@/hooks/useTravelPlan';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useSession } from 'next-auth/react';


interface ItineraryManagerProps {
  travelPlanId: string;
  travelPlan: TravelPlan;
}

export default function ItineraryManager({ travelPlanId, travelPlan }: ItineraryManagerProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: itineraries, refetch } = useItineraries(travelPlanId);
  const createItinerary = useCreateItinerary();
  const updateItineraryMutation = useUpdateItinerary();
  const deleteItineraryMutation = useDeleteItinerary();

  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<Itinerary>();

  const isOwner = session?.user?.email === travelPlan?.userEmail

  const onSubmit = async (data: Itinerary) => {
    const itineraryData = {
      ...data,
      travelPlanId,
      expense: parseFloat(data.expense.toString()) || 0,
    };

    if (editingId) {
      updateItineraryMutation.mutate(
        { ...itineraryData, _id: editingId },
        {
          onSuccess: () => {
            resetForm();
            refetch();
            router.refresh();
            alert('일정이 수정되었습니다.');
          },
          onError: (error) => {
            console.error('Error updating itinerary:', error);
            alert('일정 수정에 실패했습니다.');
          },
        }
      );
    } else {
      createItinerary.mutate(itineraryData, {
        onSuccess: () => {
          resetForm();
          router.refresh();
          alert('새 일정이 추가되었습니다.');
        },
        onError: (error) => {
          console.error('Error creating itinerary:', error);
          alert('일정 생성에 실패했습니다.');
        },
      });
    }
  };

  const handleEdit = (itinerary: Itinerary) => {
    reset(itinerary);
    setEditingId(itinerary._id);
  };

  const handleDelete = async (id: string) => {
    deleteItineraryMutation.mutate(
      { _id: id, travelPlanId },
      {
        onSuccess: () => {
          alert('일정을 삭제했습니다.');
          router.refresh();
        },
        onError: (error) => {
          console.error('Error deleting itinerary:', error);
          alert('일정 삭제에 실패했습니다.');
        },
      }
    );
  };

  const resetForm = () => {
    reset({
      date: '',
      time: '',
      activity: '',
      location: '',
      expense: 0,
      notes: '',
      category: undefined,
    });
    setEditingId(null);
  };

  return (
    <div data-cy="itinerary-manager" className='bg-white mt-3 p-6 rounded-lg border border-gray-300'>
      {isOwner && (
        <>
          <h2 className='text-2xl font-bold mb-4'>일정 관리</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div data-cy="itinerary-manager-date">
                <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                <input {...register('date')}
                  data-cy="itinerary-date-input"
                  type="date"
                  required
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
              <div data-cy="itinerary-manager-time">
                <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                <input {...register('time')}
                  data-cy="itinerary-time-input"
                  type="time"
                  required
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
              </div>
              <div data-cy="itinerary-manager-activity">
                <label className="block text-sm font-medium text-gray-700 mb-1">활동</label>
                <input {...register('activity')}
                  data-cy="itinerary-activity-input"
                  placeholder='활동'
                  required
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
              </div>
              <div data-cy="itinerary-manager-location">
                <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                <input {...register('location')}
                  data-cy="itinerary-location-input"
                  placeholder='장소'
                  required
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
              </div>
              <div data-cy="itinerary-manager-expense">
                <label className="block text-sm font-medium text-gray-700 mb-1">지출 금액</label>
                <input {...register('expense')}
                  data-cy="itinerary-expense-input"
                  type="number"
                  min="0"
                  placeholder='지출 금액'
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
              </div>
              <div data-cy="itinerary-manager-category">
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 선택</label>
                <select {...register('category')}
                  data-cy="itinerary-category-input"
                  required
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                  <option value="">카테고리 선택</option>
                  <option value="accommodation">숙박</option>
                  <option value="food">식비</option>
                  <option value="transportation">교통비</option>
                  <option value="entertainment">엔터테인먼트</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div data-cy="itinerary-manager-notes" className='col-span-full'>
                <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
                <textarea {...register('notes')}
                  data-cy="itinerary-notes-textarea"
                  placeholder='메모'
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  rows={3} />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                data-cy={editingId ? 'itinerary-manager-edit-submit' : 'itinerary-manager-add-submit'}
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {editingId ? '일정 수정' : '일정 추가'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  수정 취소
                </button>
              )}
            </div>
          </form>
        </>
      )}

      <div data-cy="itinerary-list" className="space-y-4">
        {itineraries?.map((itinerary) => (
          <div data-cy="itinerary-item" key={itinerary._id} className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out'>
            <div className='flex justify-between items-start mb-2'>
              <div>
                <h3 data-cy="itinerary-activity" className="text-lg font-semibold pb-2 text-gray-800">{itinerary.activity}</h3>
                <p data-cy="itinerary-location" className="text-sm text-gray-600">장소: {itinerary.location}</p>
              </div>
              <div className="text-right">
                <p data-cy="itinerary-date" className="text-sm font-medium text-gray-800">날짜 : {new Date(itinerary.date).toLocaleDateString()}</p>
                <p data-cy="itinerary-time" className="text-sm text-gray-600">시간 : {itinerary.time}</p>
              </div>
            </div>
            <p data-cy="itinerary-expense" className="text-lg font-bold text-blue-600 mb-2">비용 : {itinerary.expense.toLocaleString()} 원</p>
            {itinerary.notes && <p data-cy="itinerary-notes" className="text-sm text-gray-700 mb-3">메모 : {itinerary.notes}</p>}
            {isOwner && (
              <div className='flex justify-end space-x-2'>
                <button
                  data-cy="itinerary-item-edit-button"
                  onClick={() => handleEdit(itinerary)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-black  hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition ease-in-out duration-150"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  수정
                </button>
                <button
                  data-cy="itinerary-item-delete-button"
                  onClick={() => handleDelete(itinerary._id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  삭제
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
