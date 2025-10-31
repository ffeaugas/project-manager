'use client';

import { CalendarEvent } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import { NewCalendarEventType, UpdateCalendarEventType } from '@/app/api/calendar/types';

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calendar');
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch events');
        return;
      }
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = async (bodyData: NewCalendarEventType): Promise<boolean> => {
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to create event');
      }

      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = async (
    id: string,
    bodyData: Omit<UpdateCalendarEventType, 'id'>,
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/calendar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...bodyData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to update event');
      }

      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/calendar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to delete event');
      }

      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
};
