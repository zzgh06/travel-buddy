'use client';

import React, { useState } from "react";
import { FaChevronDown, FaListUl, FaChartPie } from 'react-icons/fa';
import ChecklistManager from './ChecklistManager';
import BudgetAnalysis from './BudgetAnalysis';

interface FloatingToggleManagerProps {
  travelPlanId: string;
}

type ActiveComponent = 'checklist' | 'budget';

export default function FloatingToggleManager({ travelPlanId }: FloatingToggleManagerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>('checklist');

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleComponent = () => {
    setActiveComponent(activeComponent === 'checklist' ? 'budget' : 'checklist');
  };

  return (
    <div
      data-cy="floating-toggle-manager"
      className={`fixed right-6 bottom-8 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out
      ${
        isOpen 
          ? 'w-[340px] h-auto' 
          : 'w-12 h-12 rounded-full overflow-hidden'
      }`}
    >
      <div 
        className={`flex justify-between items-center p-2 bg-gray-100 rounded-t-lg ${
          isOpen ? '' : 'hidden'
        }`}
      >
        <h3 className="font-bold">
          {activeComponent === 'checklist' ? '체크리스트' : '예산 분석'}
        </h3>
        <div className="flex items-center">
          <button 
            data-cy="toggle-button"
            onClick={toggleComponent}
            className="flex items-center p-1 px-2 mr-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
            title={activeComponent === 'checklist' ? '예산 분석으로 전환' : '체크리스트로 전환'}
          >
            {activeComponent === 'checklist' ? (
              <>
                <FaChartPie className="mr-1" />
                <span className="text-sm">예산</span>
              </>
            ) : (
              <>
                <FaListUl className="mr-1" />
                <span className="text-sm">체크리스트</span>
              </>
            )}
          </button>
          <button 
            onClick={toggleOpen}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
            title="닫기"
          >
            <FaChevronDown />
          </button>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[550px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-4">
          {activeComponent === 'checklist' ? (
            <ChecklistManager travelPlanId={travelPlanId} />
          ) : (
            <BudgetAnalysis travelPlanId={travelPlanId} />
          )}
        </div>
      </div>
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="w-full h-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
        >
          {activeComponent === 'checklist' ? <FaListUl size={20} /> : <FaChartPie size={20} />}
        </button>
      )}
    </div>
  );
}