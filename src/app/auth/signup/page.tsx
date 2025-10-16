import SignupForm from '@/components/auth/SignupForm';

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4 gap-2 w-full">
      <h1 className="text-xl font-bold">Sign Up</h1>
      <SignupForm />
    </div>
  );
}
