import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { optionalIdSchema, requiredIdSchema, requiredTitleSchema } from '@/lib/zodUtils';
import { getColumns } from '../service';

export type EntityType = 'task-columns' | 'tasks' | 'projects' | 'project-cards';

export const newTaskSchema = z.object({
  id: optionalIdSchema,
  title: requiredTitleSchema,
  description: z.string().max(2000, 'Description must be less than 2000 characters'),
  columnId: optionalIdSchema,
});

export const reorderTaskSchema = z.object({
  activeTaskId: requiredIdSchema,
  beforeTaskId: z.string().optional(),
  afterTaskId: z.string().optional(),
  targetColumnId: z.string(),
});

export type NewTaskType = z.infer<typeof newTaskSchema>;

export const TaskColumnSelect = {
  id: true,
  name: true,
  color: true,
  order: true,
  tasks: {
    select: {
      id: true,
      title: true,
      description: true,
      columnId: true,
      order: true,
      createdAt: true,
    },
    orderBy: { order: 'asc' as const },
  },
} as const;

export type ColumnWithTasks = Awaited<ReturnType<typeof getColumns>>[number];

export type Task = ColumnWithTasks['tasks'][number];
