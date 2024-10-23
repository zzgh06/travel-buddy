export interface IChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface RouteMap {
  locations: Location[];
  routeOrder: number[];
}

export interface TravelPlan {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
  description?: string;
  userEmail: string;
  budget: number;
  routeMap?: RouteMap;
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

export interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  rating: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface Location {
  id: number;
  name: string;
  position: [number, number];
  type: 'attraction' | 'restaurant' | 'hotel';
}