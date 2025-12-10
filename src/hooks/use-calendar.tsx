'use client';

import {
  calendarApi,
  type CreateCalendarEventData,
  type UpdateCalendarEventData,
} from '@/lib/api/calendar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const getCalendarKey = () => ['calendar'];

export const useCalendar = () => {
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: getCalendarKey(),
    queryFn: () => calendarApi.fetch(),
    staleTime: 60000,
  });

  const createMutation = useMutation({
    mutationFn: calendarApi.create,
    onSuccess: () => {
      toast.success('Calendar event created successfully');
      queryClient.invalidateQueries({ queryKey: getCalendarKey() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create calendar event');
    },
  });

  const updateMutation = useMutation({
    mutationFn: calendarApi.update,
    onSuccess: () => {
      toast.success('Calendar event updated successfully');
      queryClient.invalidateQueries({ queryKey: getCalendarKey() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update calendar event');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: calendarApi.delete,
    onSuccess: () => {
      toast.success('Calendar event deleted successfully');
      queryClient.invalidateQueries({ queryKey: getCalendarKey() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete calendar event');
    },
  });

  const createEvent = async (data: CreateCalendarEventData) => {
    try {
      await createMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  };

  const updateEvent = async (id: string, data: Omit<UpdateCalendarEventData, 'id'>) => {
    try {
      await updateMutation.mutateAsync({ ...data, id });
      return true;
    } catch {
      return false;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  return {
    events,
    isLoading,
    error: error?.message || null,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
