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

export const projectCardDescriptionSchema = z.string().max(20000, 'Description too long');

export const requiredDescriptionSchema = z
  .string()
  .min(1, 'Description is required')
  .max(2000, 'Description must be less than 2000 characters');

export const nameSchema = z.string().max(100, 'Name must be less than 100 characters');

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const startTimeSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format')
    .optional(),
);

export const durationSchema = z.preprocess(
  (val) =>
    val === '' ||
    val === null ||
    val === undefined ||
    (typeof val === 'number' && isNaN(val))
      ? undefined
      : Number(val),
  z.number().int().positive('Duration must be a positive number').optional(),
);

// String validation schemas
export const emailSchema = z.string().email({
  message: 'Invalid email address.',
});

export const urlSchema = z.string().url('Invalid URL');

export const requiredNameSchema = z.string().min(1, 'Name is required');

export const requiredTitleSchema = z.string().min(1, 'Title is required');

export const hexColorSchema = z
  .string()
  .regex(/^#([0-9a-fA-F]{6})$/, 'Color must be a valid hex color');

// ID schemas
export const requiredIdSchema = z.string().min(1, 'ID is required');

export const optionalIdSchema = z.string().optional();

// Password schemas
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters.' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
  .regex(/\d/, { message: 'Password must contain at least one number.' });

export const requiredPasswordSchema = z.string().min(1, {
  message: 'Password is required.',
});
