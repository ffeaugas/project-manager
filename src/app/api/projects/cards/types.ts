import { z, ZodType } from 'zod';
import { Prisma } from '@prisma/client';

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

interface NewProjectCardForm {
  id?: string;
  name: string;
  description: string;
  image?: File;
  projectId?: string;
}

export const NewProjectCardSchema: ZodType<NewProjectCardForm> = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  projectId: z.string().uuid().optional(),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "La taille de l'image ne doit pas dépasser 5MB",
    )
    .refine(
      (file) =>
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Format accepté: JPG, PNG ou WebP',
    )
    .optional(),
});

export type NewProjectCardType = z.infer<typeof NewProjectCardSchema>;
