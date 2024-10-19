export interface IChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface TravelPlan {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
  description?: string;
  budget: number;
  checklist: IChecklistItem[];
}

export type ItineraryCategory = 'accommodation' | 'food' | 'transportation' | 'entertainment' | 'other';

export interface Itinerary {
  _id: string;
  date: string;
  time: string;
  activity: string;
  location: string;
  notes?: string;
  expense: number;
  category: ItineraryCategory;
}

export interface ChecklistItem {
  _id: string;
  travelPlanId: string;
  text: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}