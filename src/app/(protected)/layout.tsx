import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { getUser } from '@/lib/auth-server';
import Header from '@/components/auth/Header';
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
      <div className="flex w-full h-full">
        <AppSidebar user={user} />
        <main className="flex-1 h-full overflow-hidden py-12 md:py-0">
          <Header userData={user} />
          {children}
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  );
}
