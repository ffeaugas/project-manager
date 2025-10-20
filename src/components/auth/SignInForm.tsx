'use client';

import { useForm } from 'react-hook-form';
import { SigninFormSchema, SigninFormValues } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormControl, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Spinner } from '../ui/spinner';
import { GithubIcon } from 'lucide-react';
import { signIn } from '@/lib/auth-client';

type ProviderEnum = Parameters<typeof signIn.social>[0]['provider'];

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: SigninFormValues) {
    if (isLoading) return;
    setIsLoading(true);
    signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          window.location.href = '/todo';
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
          window.location.href = '/todo';
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          setIsLoading(false);
        },
      },
    );
  }

  return (
    <div className="space-y-6 w-[400px] bg-zinc-800 p-4 rounded-md shadow-2xl flex flex-col justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <h1 className="text-xl font-bold text-center">Sign In</h1>

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="•••••••••••" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-center w-full">
            {isLoading ? (
              <Spinner className="w-fit h-fit" />
            ) : (
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            )}
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-500">
          {"Don't have an account? "}
          <a
            href="/auth/signup"
            className="text-green-400 underline hover:text-green-300 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </Form>
      <p>or</p>
      <Button
        className="bg-zinc-900 text-zinc-400 w-full"
        onClick={() => socialSignIn('github')}
      >
        <GithubIcon className="w-4 h-4" />
        Sign in with Github
      </Button>
    </div>
  );
};

export default SignInForm;
