import { Prisma } from '@prisma/client';
import { z, ZodType } from 'zod';

interface NewTaskForm {
  id?: string;
  title: string;
  description: string;
}

export type EntityType = 'task-columns' | 'tasks' | 'projects' | 'project-cards';

export const newTaskSchema: ZodType<NewTaskForm & { columnId?: string }> = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  columnId: z.string(),
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
};

export type TaskColumnWithTasks = Prisma.TaskColumnGetPayload<{
  select: typeof TaskColumnSelect;
}>;

export type TaskSelect = TaskColumnWithTasks['tasks'][number];
