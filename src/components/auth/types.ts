import z from 'zod';

export const SignupFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/\d/, { message: 'Password must contain at least one number.' }),
});

export type SignupFormValues = z.infer<typeof SignupFormSchema>;
