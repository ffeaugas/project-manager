import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4 gap-2 w-full">
      <ForgotPasswordForm />
    </div>
  );
}
