'use client';

import { useState } from 'react';
import TravelPlanDetail from './TravelPlanDetail';
import BudgetTracker from './BudgetTracker';
import ItineraryManager from './ItineraryManager';

interface ClientWrapperProps {
  travelPlan: any;
  itineraries: any[];
  initialTotalExpenses: number;
  initialRemainingBudget: number;
}

export default function ClientWrapper({
  travelPlan,
  itineraries,
  initialTotalExpenses,
  initialRemainingBudget
}: ClientWrapperProps) {
  const [totalExpenses, setTotalExpenses] = useState(initialTotalExpenses);
  const [remainingBudget, setRemainingBudget] = useState(initialRemainingBudget);

  const handleBudgetUpdate = (newTotalExpenses: number, newRemainingBudget: number) => {
    setTotalExpenses(newTotalExpenses);
    setRemainingBudget(newRemainingBudget);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <TravelPlanDetail travelPlan={travelPlan} />
      <BudgetTracker 
        budget={travelPlan.budget} 
        totalExpenses={totalExpenses} 
        remainingBudget={remainingBudget} 
      />
      <ItineraryManager 
        travelPlanId={travelPlan._id} 
        initialItineraries={itineraries} 
        initialBudget={travelPlan.budget}
        onBudgetUpdate={handleBudgetUpdate}
      />
    </div>
  );
}