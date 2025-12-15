import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LANDING_PAGE_CONTENT } from '@/const/landing-page-content';

export function NavigationBar() {
  return (
    <nav className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex flex-row items-center gap-2">
            <Image
              src="/transparent-eye-white.png"
              alt="Project Manager Logo"
              width={32}
              height={32}
            />
            <h1 className="text-xl font-bold font-serif">
              {LANDING_PAGE_CONTENT.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

