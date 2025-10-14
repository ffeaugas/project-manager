import { Prisma } from '@prisma/client';
import { z, ZodType } from 'zod';

interface NewTaskForm {
  id?: number;
  title: string;
  description: string;
}

export type EntityType =
  | 'task-columns'
  | 'tasks'
  | 'pages'
  | 'projects'
  | 'project-cards';

export const newTaskSchema: ZodType<
  NewTaskForm & { columnId?: number; pageName?: string }
> = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  columnId: z.number().optional(),
  pageName: z.string().optional(),
});

export type NewTaskType = z.infer<typeof newTaskSchema>;

interface NewColumnForm {
  id?: number;
  name: string;
  color: string;
}

export const newColumnSchema: ZodType<NewColumnForm> = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Title is required'),
  color: z.string().min(1, 'Color is required'),
});

export type NewColumnType = z.infer<typeof newColumnSchema>;

interface NewPageForm {
  id?: number;
  name: string;
  icon: string;
}

export const newPageSchema: ZodType<NewPageForm> = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  icon: z.string().min(1, 'Icon is required'),
});

export type NewPageType = z.infer<typeof newPageSchema>;

interface NewProjectForm {
  id?: number;
  name: string;
  description: string;
}

export const newProjectSchema: ZodType<NewProjectForm> = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type NewProjectType = z.infer<typeof newProjectSchema>;

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
