export interface TravelPlan {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
  description?: string;
  budget: number;
}

export interface Itinerary {
  _id: string;
  date: string;
  time: string;
  activity: string;
  location: string;
  notes?: string;
  expense: number;
  expenseDescription?: string;
}