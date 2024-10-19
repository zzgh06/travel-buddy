'use client';

import React, { useState } from "react";
import { useChecklistItems, useCreateChecklistItem, useDeleteChecklistItem, useUpdateChecklistItem } from "@/hooks/useTravelPlanQueries";
import { ChecklistItem } from "@/types/types";
import { FaTrash } from "react-icons/fa";

interface FloatingChecklistManagerProps {
  travelPlanId: string;
}

export default function FloatingChecklistManager({ travelPlanId }: FloatingChecklistManagerProps) {
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
    <div>
      <div className="flex mb-3">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-l-md"
          placeholder="새 항목 추가"
        />
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          추가
        </button>
      </div>
      <ul className="space-y-2 px-3 max-h-[300px] overflow-y-auto">
        {checklistItems?.map((item) => (
          <li key={item._id} className="flex items-center">
            <input
              type="checkbox"
              checked={item.isCompleted}
              onChange={() => handleToggleItem(item)}
              className="mr-2"
            />
            <span className={`${item.isCompleted ? 'line-through' : ''} max-w-[190px]`}>{item.text}</span>
            <button
              onClick={() => handleDeleteItem(item)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}