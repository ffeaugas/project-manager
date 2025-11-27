import { Prisma } from '@prisma/client';
import { LucideIcon } from 'lucide-react';
import { z } from 'zod';
import { ProjectCategoryKey } from '@prisma/client';
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

export const ProjectSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(),
  category: projectCategorySchema,
});

export const UpdateProjectSchema = ProjectSchema.extend({
  id: uuidSchema,
});

export const DeleteProjectSchema = z.object({
  id: uuidSchema,
});

export type ProjectType = z.infer<typeof ProjectSchema>;
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
