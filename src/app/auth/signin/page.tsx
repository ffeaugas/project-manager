import SignInForm from '@/components/auth/SignInForm';

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-zinc-900 text-white p-4 gap-2 w-full">
      <SignInForm />
    </div>
  );
}
