import { create } from "zustand";
import { Itinerary } from "@/types/types";

interface TravelState {
  categoryExpenses: {
    accommodation: number;
    food: number;
    transportation: number;
    entertainment: number;
    other: number;
  };
  totalExpenses: number;
  remainingBudget: number;
  budgetAlertThreshold: number;
  setBudgetAlertThreshold: (threshold: number) => void;
  updateExpenses: (itineraries: Itinerary[], budget: number) => void;
}

export const useTravelStore = create<TravelState>((set) => ({
  categoryExpenses: {
    accommodation: 0,
    food: 0,
    transportation: 0,
    entertainment: 0,
    other: 0,
  },
  totalExpenses: 0,
  remainingBudget: 0,
  budgetAlertThreshold: 0.8,
  setBudgetAlertThreshold: (threshold) => set({ budgetAlertThreshold: threshold }),
  updateExpenses: (itineraries, budget) => {
    const categoryExpenses = itineraries.reduce((acc, itinerary) => {
      acc[itinerary.category] += itinerary.expense;
      return acc;
    }, {
      accommodation: 0,
      food: 0,
      transportation: 0,
      entertainment: 0,
      other: 0,
    });

    const totalExpenses = Object.values(categoryExpenses).reduce((sum, expense) => sum + expense, 0);
    const remainingBudget = budget - totalExpenses;

    set({ categoryExpenses, totalExpenses, remainingBudget });
  },
}));