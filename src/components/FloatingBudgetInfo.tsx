'use client';

import React, { useRef, useEffect, useState } from 'react';
import BudgetAnalysis from './BudgetAnalysis';
import { FaChevronDown, FaChartPie } from 'react-icons/fa';

interface FloatingBudgetInfoProps {
  triggerRef: React.RefObject<HTMLDivElement>;
  travelPlanId: string;
}

const FloatingBudgetInfo = ({ triggerRef, travelPlanId }: FloatingBudgetInfoProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggerElement = triggerRef.current;
    const floatingElement = floatingRef.current;
    
    if (!triggerElement || !floatingElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(triggerElement);

    return () => {
      if (triggerElement) {
        observer.unobserve(triggerElement);
      }
    };
  }, [triggerRef]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={floatingRef}
      className={`fixed right-6 bottom-8 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
      } ${
        isOpen 
          ? 'w-80 h-auto' 
          : 'w-12 h-12 rounded-full overflow-hidden'
      }`}
    >
      <div 
        className={`flex justify-between items-center p-2 bg-gray-100 rounded-t-lg ${
          isOpen ? '' : 'hidden'
        }`}
      >
        <h3 className="font-bold">예산 분석</h3>
        <button 
          onClick={toggleOpen}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
        >
          <FaChevronDown />
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-4">
          <BudgetAnalysis travelPlanId={travelPlanId} />
        </div>
      </div>
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="w-full h-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
        >
          <FaChartPie size={20} />
        </button>
      )}
    </div>
  );
};

export default FloatingBudgetInfo;