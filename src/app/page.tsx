import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getUser } from '@/lib/auth-server';
import { NavigationBar } from '@/components/landing-page/NavigationBar';
import { HeroSection } from '@/components/landing-page/HeroSection';
import { FAQSection } from '@/components/landing-page/FAQSection';
import { FooterSection } from '@/components/landing-page/FooterSection';
import { LANDING_PAGE_CONTENT } from '@/const/landing-page-content';

const HomePage = async () => {
  const user = await getUser();

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh w-full gap-4 bg-dotted">
        <h1 className="text-4xl font-bold font-serif">Project Manager</h1>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-semibold">Hi {user.name} !</h2>
          <Button asChild>
            <Link href="/home">Enter the app</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-lp overflow-y-auto min-h-full">
      <NavigationBar />
      <HeroSection />
      <FAQSection questions={LANDING_PAGE_CONTENT.Questions} />
      <FooterSection />
    </div>
  );
};

export default HomePage;
