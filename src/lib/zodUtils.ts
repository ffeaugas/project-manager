import { ProjectCategoryKey } from '@prisma/client';
import { z } from 'zod';

export const imageSchema = z
  .instanceof(File)
  .refine(
    (file: File) => file.size <= 5 * 1024 * 1024,
    "La taille de l'image ne doit pas dépasser 5MB",
  )
  .refine(
    (file: File) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
    'Format accepté: JPG, PNG ou WebP',
  );

export const uuidSchema = z.string().uuid('Id must be a valid UUID');

export const projectCategorySchema = z.nativeEnum(ProjectCategoryKey);
export const descriptionSchema = z
  .string()
  .max(2000, 'Description must be less than 1000 characters');

export const nameSchema = z.string().max(100, 'Name must be less than 100 characters');
