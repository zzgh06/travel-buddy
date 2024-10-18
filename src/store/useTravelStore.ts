import { Itinerary, ItineraryCategory, TravelPlan } from "@/types/types";
import { create } from "zustand";

interface TravelState {
  travelPlan: TravelPlan | null;
  itineraries: Itinerary[];
  totalExpenses: number;
  remainingBudget: number;
  categoryExpenses: Record<ItineraryCategory, number>;
  budgetAlertThreshold: number;
  setTravelPlan: (plan: TravelPlan) => void;
  setItineraries: (itineraries: Itinerary[]) => void;
  updateBudget: (newBudget: number) => void;
  addItinerary: (itinerary: Itinerary) => void;
  updateItinerary: (id: string, updatedItinerary: Itinerary) => void;
  deleteItinerary: (id: string) => void;
  setBudgetAlertThreshold: (threshold: number) => void;
  updateCategoryExpenses: () => void;
}

export const useTravelStore = create<TravelState>((set, get) => ({
  travelPlan: null,
  itineraries: [],
  totalExpenses: 0,
  remainingBudget: 0,
  categoryExpenses: {
    accommodation: 0,
    food: 0,
    transportation: 0,
    entertainment: 0,
    other: 0,
  },
  budgetAlertThreshold: 0.8,
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
  addItinerary: (itinerary) => {
    set((state) => {
      const newItineraries = [...state.itineraries, itinerary];
      const newTotalExpenses = state.totalExpenses + itinerary.expense;
      const newRemainingBudget = state.travelPlan ? state.travelPlan.budget - newTotalExpenses : 0;
      
      if (state.travelPlan && newTotalExpenses >= state.travelPlan.budget * state.budgetAlertThreshold) {
        alert(`주의: 총 지출이 예산의 ${state.budgetAlertThreshold * 100}%를 초과했습니다!`);
      }

      return { 
        itineraries: newItineraries, 
        totalExpenses: newTotalExpenses, 
        remainingBudget: newRemainingBudget 
      };
    });
  },
  updateItinerary: (id, updatedItinerary) => {
    set((state) => {
      const newItineraries = state.itineraries.map(itinerary => 
        itinerary._id === id ? updatedItinerary : itinerary
      );
      const newTotalExpenses = newItineraries.reduce((sum, itinerary) => sum + itinerary.expense, 0);
      const newRemainingBudget = state.travelPlan ? state.travelPlan.budget - newTotalExpenses : 0;

      if (state.travelPlan && newTotalExpenses >= state.travelPlan.budget * state.budgetAlertThreshold) {
        alert(`주의: 총 지출이 예산의 ${state.budgetAlertThreshold * 100}%를 초과했습니다!`);
      }

      return { 
        itineraries: newItineraries, 
        totalExpenses: newTotalExpenses, 
        remainingBudget: newRemainingBudget 
      };
    });
  },
  deleteItinerary: (id) => {
    set((state) => {
      const newItineraries = state.itineraries.filter(itinerary => itinerary._id !== id);
      const newTotalExpenses = newItineraries.reduce((sum, itinerary) => sum + itinerary.expense, 0);
      const newRemainingBudget = state.travelPlan ? state.travelPlan.budget - newTotalExpenses : 0;
      return { 
        itineraries: newItineraries, 
        totalExpenses: newTotalExpenses, 
        remainingBudget: newRemainingBudget 
      };
    });
  },
  setBudgetAlertThreshold: (threshold) => set({ budgetAlertThreshold: threshold }),
  updateCategoryExpenses: () => {
    const { itineraries } = get();
    const categoryExpenses = itineraries.reduce((acc, itinerary) => {
      acc[itinerary.category] += itinerary.expense;
      return acc;
    }, {
      accommodation: 0,
      food: 0,
      transportation: 0,
      entertainment: 0,
      other: 0,
    } as Record<ItineraryCategory, number>);
    set({ categoryExpenses });
  },
}));