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
import { signIn, signUp } from '@/lib/auth-client';
import { GithubIcon } from 'lucide-react';
import { useState } from 'react';


type ProviderEnum = Parameters<typeof signIn.social>[0]['provider'];

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    signUp.email(
      {
        name: values.username,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          window.location.href = '/auth/email-verification';
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          setIsLoading(false);
        },
      },
    );
  }

  async function socialSignIn(provider: ProviderEnum) {
    if (isLoading) return;
    setIsLoading(true);
    signIn.social(
      {
        provider,
      },
      {
        onSuccess: () => {
          window.location.href = '/home';
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          setIsLoading(false);
        },
      },
    );
  }

  return (
    <div className="space-y-6 w-full max-w-[400px] bg-background p-4 rounded-md shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <h1 className="text-lg md:text-xl font-bold text-center">Sign Up</h1>

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
          <div className="flex justify-center w-full">
            <Button type="submit" className="w-full" isSubmitting={isLoading}>
              Sign Up
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm text-zinc-500">
          {'Already have an account? '}
          <a
            href="/auth/signin"
            className="text-green-400 underline hover:text-green-300 transition-colors"
          >
            Sign In
          </a>
        </div>
      </Form>

      <p className="text-center">or</p>
      <Button
        className="bg-card text-zinc-400 w-full"
        onClick={() => socialSignIn('github')}
      >
        <GithubIcon className="w-4 h-4" />
        Sign in with Github
      </Button>
    </div>
  );
}
