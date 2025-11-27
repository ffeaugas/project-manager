import { z } from 'zod';
import { Prisma } from '@prisma/client';
import {
  descriptionSchema,
  requiredDescriptionSchema,
  requiredNameSchema,
  urlSchema,
  uuidSchema,
} from '@/lib/zodUtils';

export const NewProjectReferenceSchema = z.object({
  name: requiredNameSchema,
  description: descriptionSchema.optional(),
  url: urlSchema.optional(),
  projectId: uuidSchema.optional(),
});

export const UpdateProjectReferenceSchema = z.object({
  id: uuidSchema,
  name: requiredNameSchema.optional(),
  description: requiredDescriptionSchema.optional(),
  url: urlSchema.optional(),
});

export const DeleteProjectReferenceSchema = z.object({
  id: uuidSchema,
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
