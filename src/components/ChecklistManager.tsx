'use client'

import React, { useState } from "react";
import { useChecklistItems, useCreateChecklistItem, useDeleteChecklistItem, useUpdateChecklistItem } from "@/hooks/useTravelPlanQueries";
import { ChecklistItem } from "@/types/types";

interface ChecklistManagerProps {
  travelPlanId: string;
}

export default function ChecklistManager({ travelPlanId }: ChecklistManagerProps) {
  const [newItemText, setNewItemText] = useState('');
  const { data: checklistItems, isLoading } = useChecklistItems(travelPlanId);
  const createMutation = useCreateChecklistItem();
  const updateMutation = useUpdateChecklistItem();
  const deleteMutation = useDeleteChecklistItem();

  const handleAddItem = () => {
    if (newItemText.trim()) {
      createMutation.mutate({ travelPlanId, text: newItemText.trim(), isCompleted: false });
      setNewItemText('');
    }
  };

  const handleToggleItem = (item: ChecklistItem) => {
    updateMutation.mutate({ ...item, isCompleted: !item.isCompleted });
  };

  const handleDeleteItem = (item: ChecklistItem) => {
    deleteMutation.mutate({ _id: item._id, travelPlanId })
  }

  if (isLoading) {
    return <div>Loading checklist...</div>
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-3">체크리스트</h3>
      <div className="flex mb-3">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-1-md"
          placeholder="새 항목 추가"
        />
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          추가
        </button>
      </div>
      <ul className="space-y-2">
        {checklistItems?.map((item) => (
          <li key={item._id} className="flex items-center">
            <input
              type="checkbox"
              checked={item.isCompleted}
              onChange={() => handleToggleItem(item)}
              className="mr-2"
            />
            <span className={item.isCompleted ? 'line-through' : ''}>{item.text}</span>
            <button
              onClick={() => handleDeleteItem(item)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}