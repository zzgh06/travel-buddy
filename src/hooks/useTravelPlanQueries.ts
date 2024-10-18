import { Itinerary, TravelPlan } from '@/types/types';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';


// 여행 계획 목록 조회
export const useTravelPlans = (): UseQueryResult<TravelPlan[], Error> => {
  return useQuery({
    queryKey: ['travelPlans'],
    queryFn: async () => {
      const { data } = await axios.get('/api/travel-plans');
      console.log("data", data)
      return data.data;
    }
  });
};

// 특정 여행 계획 조회
export const useTravelPlan = (id: string): UseQueryResult<TravelPlan, Error> => {
  return useQuery({
    queryKey: ['travelPlan', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/travel-plans/${id}`);
      return data.data.travelPlan;
    }
  });
};

// 여행 계획 생성
export const useCreateTravelPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newTravelPlan: Omit<TravelPlan, '_id'>) => axios.post('/api/travel-plans', newTravelPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelPlans'] });
    },
  });
};

// 여행 계획 수정
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

// 여행 계획 삭제
export const useDeleteTravelPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axios.delete(`/api/travel-plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelPlans'] });
    },
  });
};

// 일정 목록 조회
export const useItineraries = (travelPlanId: string): UseQueryResult<Itinerary[], Error> => {
  return useQuery({
    queryKey: ['itineraries', travelPlanId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/itineraries?travelPlanId=${travelPlanId}`);
      return data.data;
    }
  });
};

// 일정 생성
export const useCreateItinerary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newItinerary: Omit<Itinerary, '_id'>) => axios.post('/api/itineraries', newItinerary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
    },
  });
};

// 일정 수정
export const useUpdateItinerary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedItinerary: Itinerary) => axios.put(`/api/itineraries/${updatedItinerary._id}`, updatedItinerary),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itineraries', variables._id] });
    },
  });
};

// 일정 삭제
export const useDeleteItinerary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itinerary: { _id: string; travelPlanId: string }) => axios.delete(`/api/itineraries/${itinerary._id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itineraries', variables.travelPlanId] });
    },
  });
};