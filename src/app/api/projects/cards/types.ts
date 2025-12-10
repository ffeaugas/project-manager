import { z } from 'zod';
import { Prisma, ProjectCategoryKey } from '@prisma/client';
import {
  imageSchema,
  nameSchema,
  projectCardDescriptionSchema,
  uuidSchema,
} from '@/lib/zodUtils';
import { getProjectWithCards } from './service';

export const DeleteProjectCardSchema = z.object({
  id: uuidSchema,
});

export const ProjectCardSelect = {
  id: true,
  name: true,
  description: true,
  projectId: true,
  createdAt: true,
  images: {
    select: {
      id: true,
      size: true,
      mimeType: true,
      originalName: true,
      storageKey: true,
      createdAt: true,
    },
  },
} as const;

export type ProjectCardSelectType = Prisma.ProjectCardGetPayload<{
  select: typeof ProjectCardSelect;
}>;

export const ProjectSelect = {
  id: true,
  name: true,
  description: true,
  category: true,
  projectCards: {
    select: ProjectCardSelect,
  },
} as const;

export type ProjectSelectType = Prisma.ProjectGetPayload<{
  select: typeof ProjectSelect;
}>;

export type ProjectWithUrls = Omit<ProjectSelectType, 'projectCards'> & {
  category: ProjectCategoryKey;
  projectCards: Array<
    Omit<ProjectCardSelectType, 'images'> & {
      images: Array<
        Omit<ProjectCardSelectType['images'][number], 'url'> & {
          url: string;
        }
      >;
    }
  >;
};

const ProjectCardSchema = z.object({
  name: nameSchema.optional(),
  description: projectCardDescriptionSchema.optional(),
  image: imageSchema.optional(),
  projectId: uuidSchema.optional(),
});

type ProjectCardSchemaType = z.infer<typeof ProjectCardSchema>;

const isProjectCardEmpty = (
  data: Pick<ProjectCardSchemaType, 'name' | 'description' | 'image'>,
  ctx: z.RefinementCtx,
) => {
  const hasName = data.name && data.name.trim().length > 0;
  const hasDescription =
    data.description &&
    data.description !== '<p></p>' &&
    data.description.trim().length > 0;
  const hasImage = data.image !== undefined && data.image !== null;
  if (!hasName && !hasDescription && !hasImage) {
    ctx.addIssue({
      code: 'custom',
      message: 'At least one field must be provided',
      path: ['image'],
    });
  }
};

export const CreateProjectCardSchema = ProjectCardSchema.superRefine((data, ctx) => {
  isProjectCardEmpty(data, ctx);
});

export const UpdateProjectCardSchema = ProjectCardSchema.extend({
  id: uuidSchema,
}).superRefine((data, ctx) => {
  isProjectCardEmpty(data, ctx);
});

export type ProjectCardType = z.infer<typeof CreateProjectCardSchema>;
export type UpdateProjectCardType = z.infer<typeof UpdateProjectCardSchema>;
export type ProjectWithCardsType = Awaited<ReturnType<typeof getProjectWithCards>>;
