import z from 'zod';
import { emailSchema, passwordSchema, requiredPasswordSchema } from '@/lib/zodUtils';

export const SignupFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: emailSchema,
  password: passwordSchema,
});

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export const SigninFormSchema = z.object({
  email: emailSchema,
  password: requiredPasswordSchema,
});

export type SigninFormValues = z.infer<typeof SigninFormSchema>;
