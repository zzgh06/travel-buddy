import { Itinerary, TravelPlan } from "@/types/types";
import { create } from "zustand";

interface TravelState {
  travelPlan: TravelPlan | null;
  itineraries: Itinerary[];
  totalExpenses: number;
  remainingBudget: number;
  setTravelPlan: (plan: TravelPlan) => void;
  setItineraries: (itineraries: Itinerary[]) => void;
  updateBudget: (newBudget: number) => void;
  addItinerary: (itinerary: Itinerary) => void;
  updateItinerary: (id: string, updatedItinerary: Itinerary) => void;
  deleteItinerary: (id: string) => void;
}

export const useTravelStore = create<TravelState>((set) => ({
  travelPlan: null,
  itineraries: [],
  totalExpenses: 0,
  remainingBudget: 0,
  setTravelPlan: (plan) => set((state) => {
    const newRemainingBudget = plan.budget - state.totalExpenses;
    return { travelPlan: plan, remainingBudget: newRemainingBudget };
  }),
  setItineraries: (itineraries) => set((state) => {
    const newTotalExpenses = itineraries.reduce((sum, itinerary) => sum + (itinerary.expense || 0), 0);
    const newRemainingBudget = state.travelPlan ? state.travelPlan.budget - newTotalExpenses : 0;
    return { itineraries, totalExpenses: newTotalExpenses, remainingBudget: newRemainingBudget };
  }),
  updateBudget: (newBudget) => set((state) => {
    if (state.travelPlan) {
      const updatedPlan = { ...state.travelPlan, budget: newBudget };
      const newRemainingBudget = newBudget - state.totalExpenses;
      return { travelPlan: updatedPlan, remainingBudget: newRemainingBudget };
    }
    return state;
  }),
  addItinerary: (itinerary) => set((state) => {
    const newItineraries = [...state.itineraries, itinerary];
    const newTotalExpenses = state.totalExpenses + (itinerary.expense || 0);
    const newRemainingBudget = state.travelPlan ? state.travelPlan.budget - newTotalExpenses : 0;
    return { itineraries: newItineraries, totalExpenses: newTotalExpenses, remainingBudget: newRemainingBudget };
  }),
  updateItinerary: (id, updatedItinerary) => set((state) => {
    const newItineraries = state.itineraries.map(itinerary => 
      itinerary._id === id ? updatedItinerary : itinerary
    );
    const newTotalExpenses = newItineraries.reduce((sum, itinerary) => sum + (itinerary.expense || 0), 0);
    const newRemainingBudget = state.travelPlan ? state.travelPlan.budget - newTotalExpenses : 0;
    return { itineraries: newItineraries, totalExpenses: newTotalExpenses, remainingBudget: newRemainingBudget };
  }),
  deleteItinerary: (id) => set((state) => {
    const newItineraries = state.itineraries.filter(itinerary => itinerary._id !== id);
    const newTotalExpenses = newItineraries.reduce((sum, itinerary) => sum + (itinerary.expense || 0), 0);
    const newRemainingBudget = state.travelPlan ? state.travelPlan.budget - newTotalExpenses : 0;
    return { itineraries: newItineraries, totalExpenses: newTotalExpenses, remainingBudget: newRemainingBudget };
  }),
}));