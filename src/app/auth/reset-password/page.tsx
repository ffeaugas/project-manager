import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { token } = await searchParams;

  if (!token) {
    return <div>Invalid token</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4 gap-2 w-full">
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
