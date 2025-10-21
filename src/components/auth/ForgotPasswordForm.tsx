'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordFormSchema>;

const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    const email = values.email;

    await authClient.forgetPassword(
      {
        email,
        redirectTo: '/auth/reset-password',
      },
      {
        onSuccess: () => {
          router.push(`/auth/verify-email?email=${email}`);
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  }

  return (
    <div className="space-y-6 w-[400px] bg-zinc-800 p-4 rounded-md shadow-2xl flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold text-center">Forgot Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
