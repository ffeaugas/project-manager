import { Prisma } from '@prisma/client';
import { z, ZodType } from 'zod';

interface NewProjectForm {
  id?: number;
  name: string;
  description: string;
}

export const newProjectSchema: ZodType<NewProjectForm> = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type NewProjectType = z.infer<typeof newProjectSchema>;

interface NewProjectCardForm {
  id?: number;
  name: string;
  description: string;
  image?: File;
  projectId?: number;
}

export const newProjectCardSchema: ZodType<NewProjectCardForm & { projectId?: number }> =
  z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    projectId: z.number().optional(),
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

export type NewProjectCardType = z.infer<typeof newProjectCardSchema>;

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
};

export type ProjectCardSelect = Prisma.ProjectCardGetPayload<{
  select: typeof ProjectCardSelect;
}>;

export const ProjectSelect = {
  id: true,
  name: true,
  description: true,
  projectCards: {
    select: ProjectCardSelect,
  },
};

export type ProjectSelect = Prisma.ProjectGetPayload<{
  select: typeof ProjectSelect;
}>;

export type ProjectWithUrls = Omit<ProjectSelect, 'projectCards'> & {
  projectCards: Array<
    Omit<ProjectCardSelect, 'images'> & {
      images: Array<
        Omit<ProjectCardSelect['images'][0], 'url'> & {
          url: string;
        }
      >;
    }
  >;
};
