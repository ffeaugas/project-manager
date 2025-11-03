'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail } from 'lucide-react';

const EmailVerificationContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="flex items-center justify-center h-dvh bg-zinc-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>A confirmation email has been sent to</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="font-semibold text-lg mb-4">{email}</p>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to complete your sign up. If you don&apos;t see
            it, check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const EmailVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationContent />
    </Suspense>
  );
};

export default EmailVerificationPage;
