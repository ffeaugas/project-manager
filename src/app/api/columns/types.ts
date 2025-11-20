import z, { ZodType } from 'zod';

interface NewColumnForm {
  id?: string;
  name: string;
  color: string;
}

const baseColumnSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/, 'Color must be a valid hex color'),
});

export const reorderColumnSchema = z.object({
  activeColumnId: z.string().min(1, 'Active column ID is required'),
  afterColumnId: z.string().optional(),
  beforeColumnId: z.string().optional(),
});

export const newColumnSchema: ZodType<NewColumnForm> = baseColumnSchema.extend({
  id: z.string().optional(),
});

export const editColumnSchema = baseColumnSchema.extend({
  id: z.string().min(1, 'ID is required'),
});

export const deleteColumnSchema = z.object({
  id: z.string().min(1, 'Id is required'),
});

export type NewColumnType = z.infer<typeof newColumnSchema>;
export type EditColumnType = z.infer<typeof editColumnSchema>;
export type DeleteColumnType = z.infer<typeof deleteColumnSchema>;
