import SignupForm from '@/components/auth/SignupForm';

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-background2 text-foreground p-4 gap-2 w-full">
      <SignupForm />
    </div>
  );
}
