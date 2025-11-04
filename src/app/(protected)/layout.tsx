import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { getUser } from '@/lib/auth-server';
import { Toaster } from 'sonner';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-dvh relative">
        <SidebarTrigger className="absolute top-2 left-2 md:hidden bg-zinc-900 border-zinc-700 border-[1px] rounded-sm p-2" />
        <AppSidebar userData={user} />
        <main className="flex-1 h-dvh overflow-hidden">
          {children}
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  );
}
