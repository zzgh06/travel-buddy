import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { Itinerary, Location } from "@/types/types";

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
  locations: Location[];
  routeOrder: number[];
  setBudgetAlertThreshold: (threshold: number) => void;
  updateExpenses: (itineraries: Itinerary[], budget: number) => void;
  addLocation: (location: Location) => void;
  updateLocation: (id: number, updates: Partial<Location>) => void;
  removeLocation: (id: number) => void;
  setRouteOrder: (order: number[]) => void;
}

type TravelPersist = (
  config: StateCreator<TravelState>,
  options: PersistOptions<TravelState>
) => StateCreator<TravelState>;

export const useTravelStore = create<TravelState>()(
  (persist as TravelPersist)(
    (set) => ({
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
      locations: [],
      routeOrder: [],
      setBudgetAlertThreshold: (threshold) => set({ budgetAlertThreshold: threshold }),
      updateExpenses: (itineraries, budget) => {
        const categoryExpenses = itineraries.reduce((acc, itinerary) => {
          acc[itinerary.category as keyof typeof acc] += itinerary.expense;
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
      addLocation: (location) => set((state) => ({
        locations: [...state.locations, location],
        routeOrder: [...state.routeOrder, location.id]
      })),
      updateLocation: (id, updates) => set((state) => ({
        locations: state.locations.map((loc) => 
          loc.id === id ? { ...loc, ...updates } : loc
        )
      })),
      removeLocation: (id) => set((state) => ({
        locations: state.locations.filter(loc => loc.id !== id),
        routeOrder: state.routeOrder.filter(orderId => orderId !== id)
      })),
      setRouteOrder: (order) => set({ routeOrder: order }),
    }),
    {
      name: 'travel-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);