import { Prisma } from '@prisma/client';
import { LucideIcon } from 'lucide-react';
import { z } from 'zod';
import { ProjectCardSelectType } from './cards/types';

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
  description: z.string().optional(),
  category: z.string().default('other'),
});

export const UpdateProjectSchema = z.object({
  id: z.string().uuid('Id must be a valid UUID'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

export const DeleteProjectSchema = z.object({
  id: z.string().uuid('Id must be a valid UUID'),
});

export type NewProjectInput = z.infer<typeof NewProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type DeleteProjectInput = z.infer<typeof DeleteProjectSchema>;

export type ProjectCategoryKey =
  | 'other'
  | 'craft'
  | 'art'
  | 'design'
  | 'photography'
  | 'engineering'
  | 'work'
  | 'programming'
  | 'labeled';

export type ProjectCategory = {
  key: ProjectCategoryKey;
  name: string;
  description: string;
  color: string;
  icon: LucideIcon;
};

export const newProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().default('other'),
});

export type NewProjectType = z.infer<typeof newProjectSchema>;

export type ProjectSelect = Prisma.ProjectGetPayload<{
  select: typeof ProjectSelect;
}>;

export type ProjectWithUrls = Omit<ProjectSelect, 'projectCards'> & {
  projectCards: Array<
    Omit<ProjectCardSelectType, 'images'> & {
      images: Array<
        Omit<ProjectCardSelectType['images'][0], 'url'> & {
          url: string;
        }
      >;
    }
  >;
};
