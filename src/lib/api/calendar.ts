import { CalendarEvent } from '@prisma/client';
import { NewCalendarEventType, UpdateCalendarEventType } from '@/app/api/calendar/types';

export type CreateCalendarEventData = NewCalendarEventType;

export type UpdateCalendarEventData = UpdateCalendarEventType;

export const calendarApi = {
  async fetch(): Promise<CalendarEvent[]> {
    const response = await fetch('/api/calendar');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch calendar events');
    }

    const data = await response.json();
    return data || [];
  },

  async create(data: CreateCalendarEventData) {
    const response = await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create calendar event');
    }

    return response.json();
  },

  async update(data: UpdateCalendarEventData) {
    const response = await fetch('/api/calendar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update calendar event');
    }

    return response.json();
  },

  async delete(id: string) {
    const response = await fetch('/api/calendar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete calendar event');
    }

    return response.json();
  },
};

