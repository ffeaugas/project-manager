import { Prisma } from '@prisma/client';
import { LucideIcon } from 'lucide-react';
import { z } from 'zod';
import { ProjectCategoryKey } from '@/const/categories';
import {
  descriptionSchema,
  nameSchema,
  projectCategorySchema,
  uuidSchema,
} from '@/lib/zodUtils';

export const ProjectSelect = {
  id: true,
  name: true,
  category: true,
  _count: { select: { projectCards: true } },
} as const;

export type ProjectSelectType = Prisma.ProjectGetPayload<{
  select: typeof ProjectSelect;
}>;

export const NewProjectSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(),
  category: projectCategorySchema,
});

export const UpdateProjectSchema = NewProjectSchema.extend({
  id: uuidSchema,
  name: nameSchema.optional(),
});

export const DeleteProjectSchema = z.object({
  id: z.string().uuid('Id must be a valid UUID'),
});

export type NewProjectType = z.infer<typeof NewProjectSchema>;
export type UpdateProjectType = z.infer<typeof UpdateProjectSchema>;
export type DeleteProjectType = z.infer<typeof DeleteProjectSchema>;

export type ProjectCategory = {
  key: ProjectCategoryKey;
  name: string;
  description: string;
  color: string;
  icon: LucideIcon;
};

export type ProjectSelect = Prisma.ProjectGetPayload<{
  select: typeof ProjectSelect;
}>;
