'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TravelPlan {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
  description?: string;
  budget: number;
}

interface TravelPlanDetailProps {
  travelPlan: TravelPlan;
  onUpdate: (updatedTravelPlan: TravelPlan) => void;
}

export default function TravelPlanDetail({ travelPlan, onUpdate }: TravelPlanDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(travelPlan);
  const router = useRouter();

  useEffect(() => {
    setEditedPlan(travelPlan)
  }, [travelPlan])

  const handleEdit = async () => {
    if (isEditing) {
      try {
        const response = await fetch(`/api/travel-plans/${travelPlan._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editedPlan),
        });

        if (response.ok) {
          setIsEditing(false);
          onUpdate(editedPlan);
          router.refresh();
        } else {
          throw new Error('여행 계획 수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('여행 계획 수정 중 오류가 발생했습니다.');
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (confirm('정말로 이 여행 계획을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/travel-plans/${travelPlan._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/planner');
          router.refresh();
        } else {
          throw new Error('여행 계획 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('여행 계획 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === 'budget' ? Number(value) : value;
    setEditedPlan(prev => ({ ...prev, [name]: updatedValue }));

    if (name === 'budget') {
      const newBudget = Number(value);
      onUpdate({ ...editedPlan, budget: newBudget });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedPlan.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        ) : (
          travelPlan.title
        )}
      </h1>
      <div className="mb-4">
        <strong>목적지:</strong>{' '}
        {isEditing ? (
          <input
            type="text"
            name="destination"
            value={editedPlan.destination}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        ) : (
          travelPlan.destination
        )}
      </div>
      <div className="mb-4">
        <strong>기간:</strong>{' '}
        {isEditing ? (
          <>
            <input
              type="date"
              name="startDate"
              value={editedPlan.startDate.split('T')[0]}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md mr-2"
            />
            <input
              type="date"
              name="endDate"
              value={editedPlan.endDate.split('T')[0]}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md"
            />
          </>
        ) : (
          `${new Date(travelPlan.startDate).toLocaleDateString()} - ${new Date(travelPlan.endDate).toLocaleDateString()}`
        )}
      </div>
      <div className="mb-4">
        <strong>예산:</strong>{' '}
        {isEditing ? (
          <input
            type="number"
            name="budget"
            step="10000"
            value={editedPlan.budget}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        ) : (
          `${editedPlan.budget.toLocaleString()} 원`
        )}
      </div>
      {/* <div className="mb-4">
        <strong>총 지출:</strong> {totalExpenses.toLocaleString()} 원
      </div>
      <div className="mb-4">
        <strong>남은 예산:</strong> {(editedPlan.budget - totalExpenses).toLocaleString()} 원
      </div> */}
      <div className="mb-6">
        <strong>설명:</strong><br />
        {isEditing ? (
          <textarea
            name="description"
            value={editedPlan.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        ) : (
          travelPlan.description
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