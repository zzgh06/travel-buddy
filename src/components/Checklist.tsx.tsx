'use client'

import React, { useState } from 'react';

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

const Checklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');

  const addItem = () => {
    if (newItemText.trim() !== '') {
      setItems([...items, { id: Date.now(), text: newItemText, checked: false }]);
      setNewItemText('');
    }
  };

  const toggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">여행 체크리스트</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-l-md"
          placeholder="새 항목 추가"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          추가
        </button>
      </div>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              className="mr-2"
            />
            <span className={item.checked ? 'line-through' : ''}>{item.text}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checklist;