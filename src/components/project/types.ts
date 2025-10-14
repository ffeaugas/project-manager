import { Prisma } from '@prisma/client';
import { z, ZodType } from 'zod';

interface NewProjectCardForm {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
}

export const newProjectCardSchema: ZodType<NewProjectCardForm & { projectId?: number }> =
  z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().min(1, 'Image is required'),
    projectId: z.number().optional(),
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
