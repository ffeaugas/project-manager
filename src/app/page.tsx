import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getUser } from '@/lib/auth-server';

const HomePage = async () => {
  const user = await getUser();

  return (
    <div className="flex flex-col items-center justify-center h-dvh w-full gap-4">
      <h1 className="text-4xl font-bold">Project Manager</h1>
      {user ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-semibold">Hi {user.name} !</h2>
          <Button asChild>
            <Link href="/home">Enter the app</Link>
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 flex-row">
          <Button asChild>
            <Link href="/auth/signin">Se connecter</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">S&apos;inscrire</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
