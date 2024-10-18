'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Itinerary } from '@/types/types';
import { useCreateItinerary, useDeleteItinerary, useItineraries, useUpdateItinerary } from '@/hooks/useTravelPlanQueries';


interface ItineraryManagerProps {
  travelPlanId: string;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const ItineraryManager = ({ travelPlanId, triggerRef }: ItineraryManagerProps) => {
  const router = useRouter();
  const { data: itineraries, refetch  } = useItineraries(travelPlanId);
  const createItinerary = useCreateItinerary();
  const updateItineraryMutation = useUpdateItinerary();
  const deleteItineraryMutation = useDeleteItinerary();

  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<Itinerary>();

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
    <div>
      <h2 className='text-2xl font-bold mb-4'>일정 관리</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <input {...register('date')} type="date" required className='p-2 border rounded' />
          <input {...register('time')} type="time" required className='p-2 border rounded' />
          <input {...register('activity')} placeholder='활동' required className='p-2 border rounded' />
          <input {...register('location')} placeholder='장소' required className='p-2 border rounded' />
          <input {...register('expense')} type="number" step="10000" placeholder='지출 금액' className='p-2 border rounded' />
          <select {...register('category')} required className='p-2 border rounded'>
            <option value="">카테고리 선택</option>
            <option value="accommodation">숙박</option>
            <option value="food">식비</option>
            <option value="transportation">교통비</option>
            <option value="entertainment">엔터테인먼트</option>
            <option value="other">기타</option>
          </select>
          <textarea {...register('notes')} placeholder='메모' className='p-2 border rounded col-span-2' />
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editingId ? '일정 수정' : '일정 추가'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              수정 취소
            </button>
          )}
        </div>
      </form>

      <div ref={triggerRef}>
        {itineraries?.map((itinerary) => (
          <div key={itinerary._id} className='p-4 mb-4 border rounded'>
            <p>날짜 : {new Date(itinerary.date).toLocaleDateString()}</p>
            <p>시간 : {itinerary.time}</p>
            <p>활동 : {itinerary.activity}</p>
            <p>장소 : {itinerary.location}</p>
            <p>지출 : {itinerary.expense.toLocaleString()} 원</p>
            {itinerary.notes && <p>메모: {itinerary.notes}</p>}
            <div className='mt-2'>
              <button onClick={() => handleEdit(itinerary)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                수정
              </button>
              <button onClick={() => handleDelete(itinerary._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryManager;