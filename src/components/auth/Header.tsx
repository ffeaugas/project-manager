import { SidebarGroupContent, SidebarGroupLabel, SidebarTrigger } from '../ui/sidebar';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Power, User as UserIcon } from 'lucide-react';
import SignOutButton from './AuthButton';
import { User } from 'better-auth';

const Header = ({ userData }: { userData: User | undefined }) => {
  if (!userData)
    return (
      <SidebarGroupContent className="p-2 bg-zinc-900 rounded-md">
        <SidebarGroupLabel className="text-slate-200">Disconnected</SidebarGroupLabel>
        <div className="flex gap-2">
          <Button variant="auth">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
          <Button variant="auth">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </SidebarGroupContent>
    );

  return (
    <div className="flex gap-2 flex-row py-2 px-2 md:px-4 items-center justify-between border-b-[1px] border-zinc-700">
      <SidebarTrigger />
      <DropdownMenu>
        <DropdownMenuTrigger
          className="cursor-pointer space-x-2 flex flex-row items-center
        border-[1px] border-green-700 bg-zinc-800/30 py-2 px-2 md:px-4 pr-3 rounded-sm gap-2"
        >
          <p className="text-slate-200 text-xs md:text-sm font-semibold">
            {userData.name}
          </p>
          <Power size={12} className="md:w-[14px] md:h-[14px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="shadow-xl mt-1 flex flex-col gap-2 bg-zinc-800 p-2 rounded-md">
          <Button variant="auth" className="flex flex-row justify-between">
            <Link href="/account" className="text-xs md:text-sm">
              Account
            </Link>
            <UserIcon size={12} className="md:w-[14px] md:h-[14px]" />
          </Button>
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
