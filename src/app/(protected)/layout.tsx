import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
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
      <div className="flex w-full">
        <AppSidebar userData={user} />
        <SidebarInset className="overflow-hidden flex-1">
          <SidebarTrigger className="absolute top-2 left-2 md:hidden bg-card border border-border rounded-sm p-2 z-50" />
          {children}
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
