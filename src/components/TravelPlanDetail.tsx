'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteTravelPlan, useTravelPlan, useUpdateTravelPlan } from '@/hooks/useTravelPlanQueries';

interface TravelPlanDetailProps {
  travelPlanId: string;
}

export default function TravelPlanDetail({ travelPlanId }: TravelPlanDetailProps) {
  const router = useRouter();
  const { data: travelPlan, isLoading } = useTravelPlan(travelPlanId);
  const updateTravelPlan = useUpdateTravelPlan();
  const deleteTravelPlan = useDeleteTravelPlan();

  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(travelPlan);

  useEffect(() => {
    setEditedPlan(travelPlan);
  }, [travelPlan]);

  const handleEdit = async () => {
    if (isEditing && editedPlan) {
      updateTravelPlan.mutate(editedPlan, {
        onSuccess: () => {
          setIsEditing(false);
          alert('여행 계획 수정에 성공했습니다');
          router.refresh();
        },
        onError: (error) => {
          console.error('Error:', error);
          alert('여행 계획 수정 중 오류가 발생했습니다.');
        }
      });
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (confirm('정말로 이 여행 계획을 삭제하시겠습니까?')) {
      deleteTravelPlan.mutate(travelPlanId, {
        onSuccess: () => {
          router.push('/planner');
          router.refresh();
        },
        onError: (error) => {
          console.error('Error:', error);
          alert('여행 계획 삭제 중 오류가 발생했습니다.');
        }
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === 'budget' ? Number(value) : value;
    setEditedPlan((prev: any) => prev ? { ...prev, [name]: updatedValue } : null);
  };

  if (isLoading) return <div>여행 계획을 불러오는 중...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedPlan?.title || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        ) : (
          travelPlan?.title
        )}
      </h1>
      <div className="mb-4">
        <strong>목적지:</strong>{' '}
        {isEditing ? (
          <input
            type="text"
            name="destination"
            value={editedPlan?.destination || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        ) : (
          travelPlan?.destination
        )}
      </div>
      <div className="mb-4">
        <strong>기간:</strong>{' '}
        {isEditing ? (
          <>
            <input
              type="date"
              name="startDate"
              value={editedPlan?.startDate.split('T')[0] || ''}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md mr-2"
            />
            <input
              type="date"
              name="endDate"
              value={editedPlan?.endDate.split('T')[0] || ''}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md"
            />
          </>
        ) : (
          `${new Date(travelPlan?.startDate || "").toLocaleDateString()} - ${new Date(travelPlan?.endDate || "").toLocaleDateString()}`
        )}
      </div>
      <div className="mb-4">
        <strong>예산:</strong>{' '}
        {isEditing ? (
          <input
            type="number"
            name="budget"
            step="10000"
            value={editedPlan?.budget || 0}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        ) : (
          `${travelPlan?.budget.toLocaleString()} 원`
        )}
      </div>
      <div className="mb-6">
        <strong>설명:</strong><br />
        {isEditing ? (
          <textarea
            name="description"
            value={editedPlan?.description || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        ) : (
          travelPlan?.description
        )}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isEditing ? '저장' : '수정'}
        </button>
        {!isEditing && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}