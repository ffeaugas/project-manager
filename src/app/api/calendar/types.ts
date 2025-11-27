import { z } from 'zod';
import {
  uuidSchema,
  requiredDescriptionSchema,
  dateSchema,
  startTimeSchema,
  durationSchema,
} from '@/lib/zodUtils';
import { CalendarEventCategoryKey } from '@prisma/client';

export const NewCalendarEventSchema = z.object({
  description: requiredDescriptionSchema,
  date: dateSchema,
  startTime: startTimeSchema,
  duration: durationSchema,
  category: z
    .nativeEnum(CalendarEventCategoryKey)
    .default('default' satisfies CalendarEventCategoryKey),
});

export const UpdateCalendarEventSchema = z.object({
  id: uuidSchema,
  description: requiredDescriptionSchema.optional(),
  date: dateSchema.optional(),
  startTime: startTimeSchema,
  duration: durationSchema,
  category: z.nativeEnum(CalendarEventCategoryKey),
});

export const DeleteCalendarEventSchema = z.object({
  id: uuidSchema,
});

export type NewCalendarEventType = z.infer<typeof NewCalendarEventSchema>;
export type UpdateCalendarEventType = z.infer<typeof UpdateCalendarEventSchema>;
export type DeleteCalendarEventType = z.infer<typeof DeleteCalendarEventSchema>;
