import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarTrigger,
} from '../ui/sidebar';
import Link from 'next/link';
import { User } from 'better-auth';
import { Button } from '../ui/button';

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
            <Link href="/auth/signip">Sign In</Link>
          </Button>
        </div>
      </SidebarGroupContent>
    );

  return (
    <div className="flex gap-2 flex-row py-2 px-4 items-center justify-between">
      <SidebarTrigger />
      <div className="space-x-2 flex flex-row items-center">
        <p className="text-slate-200 text-sm font-semibold">{userData.name}</p>
        <Button variant="auth">
          <Link href="/auth/signout">Sign Out</Link>
        </Button>
      </div>
    </div>
  );
};

export default Header;
