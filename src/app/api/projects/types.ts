import { Prisma } from '@prisma/client';
import { LucideIcon } from 'lucide-react';
import { z } from 'zod';

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
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().default('other'),
});

export const UpdateProjectSchema = z.object({
  id: z.number().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  category: z.string().optional(),
});

export const DeleteProjectSchema = z.object({
  id: z.number().min(1, 'Id is required'),
});

export type NewProjectInput = z.infer<typeof NewProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type DeleteProjectInput = z.infer<typeof DeleteProjectSchema>;

export type ProjectCategoryKey =
  | 'other'
  | 'wood'
  | 'diy'
  | 'construction'
  | 'nature'
  | 'product'
  | 'design'
  | 'packaging'
  | 'engineering'
  | 'files'
  | 'labeled';

export type ProjectCategory = {
  key: ProjectCategoryKey;
  name: string;
  description: string;
  color: string;
  icon: LucideIcon;
};
