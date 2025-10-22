'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendVerificationEmail } from '@/lib/auth-client';

const EmailVerificationResendPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();

  if (!email) {
    return <div>Email not found</div>;
  }

  const resendVerificationEmail = async () => {
    if (!email) return;

    const response = await sendVerificationEmail({ email });
    if (response.error) {
      alert(response.error.message);
    } else {
      router.push(`/auth/email-verification?email=${email}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 p-4">
      <Card className="w-full max-w-md space-y-6">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Email verification required</CardTitle>
          <CardDescription>Please verify your email address to continue.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <CardDescription>Need new verification email?</CardDescription>
          <Button onClick={resendVerificationEmail}>Resend verification email</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationResendPage;
