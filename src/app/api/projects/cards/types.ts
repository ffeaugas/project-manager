import { z, ZodType } from 'zod';
import { Prisma } from '@prisma/client';
import { descriptionSchema, imageSchema, nameSchema, uuidSchema } from '@/lib/zodUtils';

export const DeleteProjectCardSchema = z.object({
  id: z.string().uuid('Id must be a valid UUID'),
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

export const NewProjectCardSchema = z
  .object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    projectId: uuidSchema.optional(),
    image: imageSchema.optional(),
  })
  .refine(
    (data) => {
      const hasName = data.name && data.name.trim().length > 0;
      const hasDescription = data.description && data.description.trim().length > 0;
      const hasImage = data.image !== undefined && data.image !== null;
      return hasName || hasDescription || hasImage;
    },
    {
      message: 'At least one field must be provided',
    },
  );

export const UpdateProjectCardSchema = z.object({
  id: uuidSchema,
  name: nameSchema.optional(),
  description: descriptionSchema.optional(),
  image: imageSchema.optional(),
});

export type NewProjectCardType = z.infer<typeof NewProjectCardSchema>;
export type UpdateProjectCardType = z.infer<typeof UpdateProjectCardSchema>;
