'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SignupFormSchema, SignupFormValues } from './types';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: SignupFormValues) {
    console.log(values);
    signUp.email(
      {
        name: values.username,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (response) => {
          router.push('/auth');
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[400px]">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your funny nickname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="exemple@email.com" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                We will never share your email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="•••••••••••" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Minimum 8 characters, one lowercase letter, one number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
