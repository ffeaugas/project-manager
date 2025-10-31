import { prisma } from '@/lib/prisma';
import { NewCalendarEventType, UpdateCalendarEventType } from './types';
import { CalendarEvent } from '@prisma/client';

export async function getCalendarEvents(userId: string): Promise<CalendarEvent[]> {
  const events = await prisma.calendarEvent.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });

  return events;
}

export async function getCalendarEventsByDate(
  userId: string,
  date: string,
): Promise<CalendarEvent[]> {
  const events = await prisma.calendarEvent.findMany({
    where: {
      userId,
      date: {
        gte: new Date(date),
        lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { date: 'asc' },
  });

  return events;
}

export async function createCalendarEvent(
  data: NewCalendarEventType,
  userId: string,
): Promise<CalendarEvent> {
  const event = await prisma.calendarEvent.create({
    data: {
      userId,
      description: data.description,
      date: new Date(data.date),
      startTime: data.startTime || null,
      duration: data.duration || null,
    },
  });

  return event;
}

export async function updateCalendarEvent(
  id: string,
  data: UpdateCalendarEventType,
  userId: string,
): Promise<CalendarEvent> {
  const existingEvent = await prisma.calendarEvent.findUnique({
    where: { id },
  });

  if (!existingEvent) {
    throw new Error('Calendar event not found');
  }

  if (existingEvent.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const updated = await prisma.calendarEvent.update({
    where: { id },
    data: {
      description: data.description,
      date: data.date ? new Date(data.date) : undefined,
      startTime: data.startTime,
      duration: data.duration,
    },
  });

  return updated;
}

export async function deleteCalendarEvent(id: string, userId: string): Promise<void> {
  const existingEvent = await prisma.calendarEvent.findUnique({
    where: { id },
  });

  if (!existingEvent) {
    throw new Error('Calendar event not found');
  }

  if (existingEvent.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await prisma.calendarEvent.delete({
    where: { id },
  });
}
