import { z } from 'zod';
import { Prisma } from '@prisma/client';
import {
  uuidSchema,
  requiredDescriptionSchema,
  dateSchema,
  startTimeSchema,
  durationSchema,
  calendarEventCategorySchema,
} from '@/lib/zodUtils';

/**
 * CalendarEvent type derived from Prisma schema.
 * This will automatically update if the Prisma schema changes.
 */
export type CalendarEvent = Prisma.CalendarEventGetPayload<{}>;

export const NewCalendarEventSchema = z.object({
  description: requiredDescriptionSchema,
  date: dateSchema,
  startTime: startTimeSchema,
  duration: durationSchema,
  category: calendarEventCategorySchema,
});

export const UpdateCalendarEventSchema = z.object({
  id: uuidSchema,
  description: requiredDescriptionSchema.optional(),
  date: dateSchema.optional(),
  startTime: startTimeSchema,
  duration: durationSchema,
  category: calendarEventCategorySchema,
});

export const DeleteCalendarEventSchema = z.object({
  id: uuidSchema,
});

export type NewCalendarEventType = z.infer<typeof NewCalendarEventSchema>;
export type UpdateCalendarEventType = z.infer<typeof UpdateCalendarEventSchema>;
export type DeleteCalendarEventType = z.infer<typeof DeleteCalendarEventSchema>;
