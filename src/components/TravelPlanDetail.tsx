'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteTravelPlan, useTravelPlan, useUpdateTravelPlan } from '@/hooks/useTravelPlanQueries';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

interface TravelPlanDetailProps {
  travelPlanId: string;
}

export default function TravelPlanDetail({ travelPlanId }: TravelPlanDetailProps) {
  const router = useRouter();
  const { data: travelPlan } = useTravelPlan(travelPlanId);
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

  if (!travelPlan) {
    return <div data-cy="travel-plan-detail-loading">Loading travel plan details...</div>;
  }

  return (
    <div data-cy="travel-plan-detail" className="max-w-4xl mx-auto my-3 p-6 bg-white rounded-lg border border-gray-300">
      <h1 data-cy="travel-plan-title" className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        {isEditing ? (
          <input
            data-cy="travel-plan-title-input"
            type="text"
            name="title"
            value={editedPlan?.title || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          travelPlan?.title
        )}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div data-cy="travel-plan-destination">
            <label className="block text-md font-medium text-gray-700 mb-1">목적지</label>
            {isEditing ? (
              <input
                data-cy="travel-plan-destination-input"
                type="text"
                name="destination"
                value={editedPlan?.destination || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p data-cy="travel-plan-destination" className="text-lg text-gray-800">{travelPlan?.destination}</p>
            )}
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">기간</label>
            {isEditing ? (
              <div className="flex space-x-2">
                <input
                  data-cy="travel-plan-startDate-input"
                  type="date"
                  name="startDate"
                  value={editedPlan?.startDate.split('T')[0] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  data-cy="travel-plan-endDate-input"
                  type="date"
                  name="endDate"
                  value={editedPlan?.endDate.split('T')[0] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <p data-cy="travel-plan-date" className="text-lg text-gray-800">{`${new Date(travelPlan?.startDate || "").toLocaleDateString()} - ${new Date(travelPlan?.endDate || "").toLocaleDateString()}`}</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">예산</label>
            {isEditing ? (
              <input
                data-cy="travel-plan-budget-input"
                type="number"
                name="budget"
                step="10000"
                value={editedPlan?.budget || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p data-cy="travel-plan-budget" className="text-lg text-gray-800">{`${travelPlan?.budget.toLocaleString()} 원`}</p>
            )}
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">설명</label>
            {isEditing ? (
              <textarea
                data-cy="travel-plan-description-textarea"
                name="description"
                value={editedPlan?.description || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            ) : (
              <p  data-cy="travel-plan-description" className="text-lg text-gray-800">{travelPlan?.description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          data-cy={isEditing ? 'plan-detail-edit-button' : 'plan-detail-button'}
          onClick={handleEdit}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-black  hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition ease-in-out duration-150"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          {isEditing ? '저장' : '수정'}
        </button>
        {!isEditing && (
          <button
            data-cy="plan-detail-delete-button"
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            삭제
          </button>
        )}
      </div>
    </div>
  );
}