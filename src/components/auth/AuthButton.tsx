'use client';

import { signOut } from '@/lib/auth-client';
import { Button } from '../ui/button';
import { PowerOff } from 'lucide-react';

const SignOutButton = () => {
  return (
    <Button
      variant="auth"
      onClick={async () => {
        await signOut();
        window.location.href = '/auth/signin';
      }}
      className="flex flex-row justify-between"
    >
      <span className="text-sm">Sign Out</span>
      <PowerOff size={10} />
    </Button>
  );
};

export default SignOutButton;
