'use client';

import { useCallback, useEffect, useState } from 'react';
import TravelPlanDetail from './TravelPlanDetail';
import BudgetTracker from './BudgetTracker';
import ItineraryManager from './ItineraryManager';

interface ClientWrapperProps {
  travelPlan: any;
  itineraries: any[];
  initialTotalExpenses: number;
}

export default function ClientWrapper({
  travelPlan: initialTravelPlan,
  itineraries: initialItineraries,
  initialTotalExpenses,
}: ClientWrapperProps) {
  const [travelPlan, setTravelPlan] = useState(initialTravelPlan);
  const [itineraries, setItineraries] = useState(initialItineraries);
  const [totalExpenses, setTotalExpenses] = useState(initialTotalExpenses);
  const [remainingBudget, setRemainingBudget] = useState(initialTravelPlan.budget - initialTotalExpenses);

  const updateBudget = useCallback((newBudget: number) => {
    setTravelPlan((prev: any) => ({ ...prev, budget: newBudget }));
    setRemainingBudget(newBudget - totalExpenses);
  }, [totalExpenses]);

  const updateExpenses = useCallback((newTotalExpenses: number) => {
    setTotalExpenses(newTotalExpenses);
    setRemainingBudget(travelPlan.budget - newTotalExpenses);
  }, [travelPlan.budget]);

  useEffect(() => {
    setRemainingBudget(travelPlan.budget - totalExpenses);
  }, [travelPlan.budget, totalExpenses]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <TravelPlanDetail 
        travelPlan={travelPlan} 
        onUpdate={(updatedPlan) => {
          setTravelPlan(updatedPlan);
          updateBudget(updatedPlan.budget);
        }} 
      />
      <BudgetTracker 
        budget={travelPlan.budget} 
        totalExpenses={totalExpenses} 
        remainingBudget={remainingBudget} 
      />
      <ItineraryManager 
        travelPlanId={travelPlan._id} 
        initialItineraries={itineraries}
        onItinerariesUpdate={(updatedItineraries) => {
          setItineraries(updatedItineraries);
          const newTotalExpenses = updatedItineraries.reduce((sum, itinerary) => sum + (itinerary.expense || 0), 0);
          updateExpenses(newTotalExpenses);
        }}
      />
    </div>
  );
}