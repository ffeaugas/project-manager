import { z } from 'zod';

export const NewCalendarEventSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z
      .string()
      .regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format')
      .optional(),
  ),
  duration: z.preprocess(
    (val) =>
      val === '' ||
      val === null ||
      val === undefined ||
      (typeof val === 'number' && isNaN(val))
        ? undefined
        : Number(val),
    z.number().int().positive('Duration must be a positive number').optional(),
  ),
  category: z.string().default('default'),
});

export const UpdateCalendarEventSchema = z.object({
  id: z.string().uuid('Id must be a valid UUID'),
  description: z.string().min(1, 'Description is required').optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  startTime: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z
      .string()
      .regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format')
      .optional(),
  ),
  duration: z.preprocess(
    (val) =>
      val === '' ||
      val === null ||
      val === undefined ||
      (typeof val === 'number' && isNaN(val))
        ? undefined
        : Number(val),
    z.number().int().positive('Duration must be a positive number').optional(),
  ),
  category: z.string().optional(),
});

export const DeleteCalendarEventSchema = z.object({
  id: z.string().uuid('Id must be a valid UUID'),
});

export type NewCalendarEventType = z.infer<typeof NewCalendarEventSchema>;
export type UpdateCalendarEventType = z.infer<typeof UpdateCalendarEventSchema>;
export type DeleteCalendarEventType = z.infer<typeof DeleteCalendarEventSchema>;
