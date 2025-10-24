import { z } from 'zod';

export const NewProjectCardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  projectId: z.number().min(1, 'Project ID is required'),
});

export const UpdateProjectCardSchema = z.object({
  id: z.number().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  projectId: z.number().min(1, 'Project ID is required').optional(),
});

export const DeleteProjectCardSchema = z.object({
  id: z.number().min(1, 'Id is required'),
});
