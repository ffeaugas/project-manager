import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
      <h1 className="text-4xl font-bold">Project Manager</h1>
      <div className="flex gap-2 flex-row">
        <Button>
          <Link href="/auth/signin">Se connecter</Link>
        </Button>
        <Button>
          <Link href="/auth/signup">S'inscrire</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
