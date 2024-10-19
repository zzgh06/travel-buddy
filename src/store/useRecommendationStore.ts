import { create } from 'zustand';

interface RecommendationState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
}));