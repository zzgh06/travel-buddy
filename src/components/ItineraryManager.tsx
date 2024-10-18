'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface Itinerary {
  _id: string;
  date: string;
  time: string;
  activity: string;
  location: string;
  notes?: string;
  expense: number;
  expenseDescription?: string;
}

interface ItineraryManagerProps {
  travelPlanId: string;
  initialItineraries: Itinerary[];
  onItinerariesUpdate: (itineraries: Itinerary[]) => void;
}

const ItineraryManager = ({ travelPlanId, initialItineraries, onItinerariesUpdate }: ItineraryManagerProps) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>(initialItineraries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<Itinerary>();
  const router = useRouter();

  useEffect(() => {
    onItinerariesUpdate(itineraries);
  }, [itineraries, onItinerariesUpdate]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch(`/api/travel-plans/${travelPlanId}`);
        if (response.ok) {
          const { data } = await response.json();
          setItineraries(data.itineraries);
        } else {
          throw new Error('Failed to fetch itineraries');
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
        alert('일정을 불러오는데 실패했습니다.');
      }
    };

    fetchItineraries();
  }, [travelPlanId]);

  const onSubmit = async (data: Itinerary) => {
    try {
      const url = editingId ? `/api/itineraries/${editingId}` : '/api/itineraries';
      const method = editingId ? 'PUT' : 'POST';
  
      const expense = parseFloat(data.expense.toString()) || 0;
  
      const itineraryData = {
        ...data,
        travelPlanId,
        expense,
        expenseDescription: data.expenseDescription || ''
      };
  
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itineraryData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save itinerary');
      }
  
      const result = await response.json();
      
      if (editingId) {
        setItineraries(itineraries.map(item => item._id === editingId ? result.data : item));
      } else {
        setItineraries([...itineraries, result.data]);
      }
  
      reset({
        date: '',
        time: '',
        activity: '',
        location: '',
        notes: '',
        expense: 0,
        expenseDescription: ''
      });
      setEditingId(null);
  
      router.refresh();
      alert(editingId ? '일정이 수정되었습니다.' : '새 일정이 추가되었습니다.');
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert(error instanceof Error ? error.message : '일정 저장에 실패했습니다.');
    }
  };

  const handleEdit = (itinerary: Itinerary) => {
    reset(itinerary);
    setEditingId(itinerary._id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/itineraries/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setItineraries(itineraries.filter(item => item._id !== id));
      } else {
        throw new Error('Failed to delete itinerary');
      }
      reset();
      alert('일정을 삭제했습니다.');
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      alert('일정 삭제에 실패했습니다.');
    }
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
          <input {...register('expense')} type="number" step="1000" placeholder='지출 금액' className='p-2 border rounded' />
          <input {...register('expenseDescription')} placeholder='지출 내역' className='p-2 border rounded' />
          <textarea {...register('notes')} placeholder='메모' className='p-2 border rounded col-span-2' />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingId ? '일정 수정' : '일정 추가'}
        </button>
      </form>

      <div>
        {itineraries.map((itinerary) => (
          <div key={itinerary._id} className='p-4 mb-4 border rounded'>
            <p>날짜 : {new Date(itinerary.date).toLocaleDateString()}</p>
            <p>시간 : {itinerary.time}</p>
            <p>활동 : {itinerary.activity}</p>
            <p>장소 : {itinerary.location}</p>
            <p>지출 : {itinerary.expense.toLocaleString()} 원</p>
            {itinerary.expenseDescription && <p>지출 내역: {itinerary.expenseDescription}</p>}
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