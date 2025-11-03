import { Toaster } from 'sonner';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-dvh w-full">
      {children}
      <Toaster />
    </div>
  );
}
