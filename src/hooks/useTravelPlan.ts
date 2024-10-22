import { ChecklistItem, Itinerary, TravelPlan } from '@/types/types';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

export const useTravelPlans = (): UseQueryResult<TravelPlan[], Error> => {
  return useQuery({
    queryKey: ['travelPlans'],
    queryFn: async () => {
      const { data } = await axios.get('/api/travel-plans');
      return data.data;
    }
  });
};

export const useTravelPlan = (id: string): UseQueryResult<TravelPlan, Error> => {
  return useQuery({
    queryKey: ['travelPlan', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/travel-plans/${id}`);
      return data.data.travelPlan;
    }
  });
};

export const useCreateTravelPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newTravelPlan: Omit<TravelPlan, '_id'>) => axios.post('/api/travel-plans', newTravelPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelPlans'] });
    },
  });
};

export const useUpdateTravelPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedTravelPlan: TravelPlan) => axios.put(`/api/travel-plans/${updatedTravelPlan._id}`, updatedTravelPlan),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['travelPlans'] });
      queryClient.invalidateQueries({ queryKey: ['travelPlan', variables._id] });
    },
  });
};

export const useDeleteTravelPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axios.delete(`/api/travel-plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelPlans'] });
    },
  });
};

export const useItineraries = (travelPlanId: string): UseQueryResult<Itinerary[], Error> => {
  return useQuery({
    queryKey: ['itineraries', travelPlanId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/itineraries?travelPlanId=${travelPlanId}`);
      return data.data;
    }
  });
};

export const useCreateItinerary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newItinerary: Omit<Itinerary, '_id'>) => axios.post('/api/itineraries', newItinerary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
    },
  });
};

export const useUpdateItinerary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedItinerary: Itinerary) => axios.put(`/api/itineraries/${updatedItinerary._id}`, updatedItinerary),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itineraries', variables._id] });
    },
  });
};

export const useDeleteItinerary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itinerary: { _id: string; travelPlanId: string }) => axios.delete(`/api/itineraries/${itinerary._id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itineraries', variables.travelPlanId] });
    },
  });
};

export const useChecklistItems = (travelPlanId: string): UseQueryResult<ChecklistItem[], Error> => {
  return useQuery({
    queryKey: ['checklistItems', travelPlanId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/checklist-items?travelPlanId=${travelPlanId}`);
      return data.data;
    }
  });
};

export const useCreateChecklistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newItem: Omit<ChecklistItem, '_id' | 'createdAt' | 'updatedAt'>) => 
      axios.post('/api/checklist-items', newItem),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklistItems', variables.travelPlanId] });
    },
  });
};

export const useUpdateChecklistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedItem: ChecklistItem) => 
      axios.put(`/api/checklist-items/${updatedItem._id}`, updatedItem),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklistItems', variables.travelPlanId] });
    },
  });
};

export const useDeleteChecklistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: { _id: string; travelPlanId: string }) => 
      axios.delete(`/api/checklist-items/${item._id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklistItems', variables.travelPlanId] });
    },
  });
};