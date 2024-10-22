import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Location } from '@/types/types';

interface RouteMapData {
  locations: Location[];
  routeOrder: number[];
}

export const useUpdateRouteMap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ travelPlanId, routeMap }: { travelPlanId: string; routeMap: RouteMapData }) => {
      const { data } = await axios.put(`/api/travel-plans/${travelPlanId}`, {
        routeMap
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['travelPlan', variables.travelPlanId]});
    },
  });
};

export const useAddLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      travelPlanId, 
      location, 
      currentLocations, 
      currentRouteOrder 
    }: {
      travelPlanId: string;
      location: Location;
      currentLocations: Location[];
      currentRouteOrder: number[];
    }) => {
      const newLocations = [...currentLocations, location];
      const newRouteOrder = [...currentRouteOrder, location.id];

      const { data } = await axios.put(`/api/travel-plans/${travelPlanId}`, {
        routeMap: {
          locations: newLocations,
          routeOrder: newRouteOrder
        }
      });
      return { data, newLocations, newRouteOrder };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['travelPlan', variables.travelPlanId]});
    },
  });
};

export const useRemoveLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      travelPlanId, 
      locationId, 
      currentLocations, 
      currentRouteOrder 
    }: {
      travelPlanId: string;
      locationId: number;
      currentLocations: Location[];
      currentRouteOrder: number[];
    }) => {
      const newLocations = currentLocations.filter(loc => loc.id !== locationId);
      const newRouteOrder = currentRouteOrder.filter(id => id !== locationId);

      const { data } = await axios.put(`/api/travel-plans/${travelPlanId}`, {
        routeMap: {
          locations: newLocations,
          routeOrder: newRouteOrder
        }
      });
      return { data, newLocations, newRouteOrder };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['travelPlan', variables.travelPlanId]});
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      travelPlanId, 
      locationId, 
      updates, 
      currentLocations,
      currentRouteOrder
    }: {
      travelPlanId: string;
      locationId: number;
      updates: Partial<Location>;
      currentLocations: Location[];
      currentRouteOrder: number[];
    }) => {
      const newLocations = currentLocations.map(loc =>
        loc.id === locationId ? { ...loc, ...updates } : loc
      );

      const { data } = await axios.put(`/api/travel-plans/${travelPlanId}`, {
        routeMap: {
          locations: newLocations,
          routeOrder: currentRouteOrder
        }
      });
      return { data, newLocations };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['travelPlan', variables.travelPlanId]});
    },
  });
};

export const useUpdateRouteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      travelPlanId, 
      newOrder,
      currentLocations 
    }: {
      travelPlanId: string;
      newOrder: number[];
      currentLocations: Location[];
    }) => {
      const { data } = await axios.put(`/api/travel-plans/${travelPlanId}`, {
        routeMap: {
          locations: currentLocations,
          routeOrder: newOrder
        }
      });
      return { data, newOrder };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['travelPlan', variables.travelPlanId]});
    },
  });
};