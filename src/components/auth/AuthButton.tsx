'use client';

import { signOut } from '@/lib/auth-client';
import { Button } from '../ui/button';
import { User as UserIcon, Menu, PowerOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../ui/dropdown-menu';
import Link from 'next/link';
import { User } from 'better-auth';

const AuthButton = ({ userData }: { userData: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer flex flex-row items-center
    rounded-sm justify-between w-[90%] mx-auto my-2 hover:bg-zinc-700 py-2 px-4"
      >
        <div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-foreground text-xs md:text-sm bg-blue-400 w-6 h-6 flex items-center justify-center rounded-sm">
              {userData.name.slice(0, 1)}
            </span>
            <p className="text-muted-foreground text-xs md:text-sm font-semibold">
              {userData.name}
            </p>
          </div>
        </div>

        <Menu size={12} className="md:w-[14px] md:h-[14px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-xl mt-1 flex flex-col gap-2 bg-background p-2 rounded-md w-48">
        <Button variant="auth" className="flex flex-row justify-between">
          <Link href="/account" className="text-xs md:text-sm">
            Account
          </Link>
          <UserIcon size={12} className="md:w-[14px] md:h-[14px]" />
        </Button>
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;

const SignOutButton = () => {
  return (
    <Button
      variant="auth"
      onClick={async () => {
        await signOut();
        window.location.href = '/';
      }}
      className="flex flex-row justify-between"
    >
      <span className="text-sm">Sign Out</span>
      <PowerOff size={10} />
    </Button>
  );
};
