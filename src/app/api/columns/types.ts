import z from 'zod';
import {
  hexColorSchema,
  optionalIdSchema,
  requiredIdSchema,
  requiredNameSchema,
} from '@/lib/zodUtils';

const baseColumnSchema = z.object({
  name: requiredNameSchema,
  color: hexColorSchema,
});

export const reorderColumnSchema = z.object({
  activeColumnId: requiredIdSchema,
  afterColumnId: z.string().optional(),
  beforeColumnId: z.string().optional(),
});

export const newColumnSchema = baseColumnSchema.extend({
  id: optionalIdSchema,
});

export const editColumnSchema = baseColumnSchema.extend({
  id: requiredIdSchema,
});

export const deleteColumnSchema = z.object({
  id: requiredIdSchema,
});

export type NewColumnType = z.infer<typeof newColumnSchema>;
export type EditColumnType = z.infer<typeof editColumnSchema>;
export type DeleteColumnType = z.infer<typeof deleteColumnSchema>;
