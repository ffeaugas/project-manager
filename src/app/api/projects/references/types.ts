import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const NewProjectReferenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  url: z.string().url('Invalid URL').optional(),
  projectId: z.string().uuid().optional(),
});

export const UpdateProjectReferenceSchema = z.object({
  id: z.string().uuid('Id must be a valid UUID'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  url: z.string().url('Invalid URL').optional(),
});

export const DeleteProjectReferenceSchema = z.object({
  id: z.string().uuid('Id must be a valid UUID'),
});

export const ProjectReferenceSelect = {
  id: true,
  name: true,
  description: true,
  url: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ProjectReferenceSelectType = Prisma.ProjectReferenceGetPayload<{
  select: typeof ProjectReferenceSelect;
}>;

export type NewProjectReferenceType = z.infer<typeof NewProjectReferenceSchema>;
export type UpdateProjectReferenceType = z.infer<typeof UpdateProjectReferenceSchema>;
export type DeleteProjectReferenceType = z.infer<typeof DeleteProjectReferenceSchema>;
