import { Prisma } from '@prisma/client';
import { z, ZodType } from 'zod';

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
  imageUrl: true,
  projectId: true,
  createdAt: true,
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
