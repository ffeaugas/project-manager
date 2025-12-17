'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LANDING_PAGE_CONTENT } from '@/const/landing-page-content';
import { ArrowRight } from 'lucide-react';
import Eye from '@/components/landing-page/eye';
import FeatureCard from './FeatureCard';
import { useIsMobile } from '@/hooks/use-mobile';

export function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden bg-dotted-transparent">
      <div className="w-full text-center space-y-4 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 justify-center flex-row">
          <Eye />
          <h1 className="text-2xl sm:text-6xl lg:text-8xl font-bold tracking-tight font-cursive">
            {LANDING_PAGE_CONTENT.title}
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {LANDING_PAGE_CONTENT.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-10 relative">
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/auth/signup">
              Get started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg px-8">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        </div>

        {/* App Screenshot 1 */}
        <div className="xl:mx-40 lg:mx-30 md:mx-20 mx-10 mt-40 flex flex-col gap-4 relative">
          <Image
            src="/start-monster-white.png"
            alt="Project Manager Logo"
            width={isMobile ? 120 : 180}
            height={isMobile ? 120 : 180}
            className="absolute left-[10%] top-0 translate-y-[-110%]"
          />
          <Image
            src="/transparent-monster-white.png"
            alt="Project Manager Logo"
            width={isMobile ? 110 : 170}
            height={isMobile ? 110 : 170}
            className="absolute top-0 right-[10%] translate-y-[-100%]"
          />
          <div className="rounded-xl border bg-card overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow border-white border-2">
            <Image
              src="/lp-2.png"
              alt="Project Manager Screenshot 2"
              width={800}
              height={600}
              className="w-full h-auto"
              priority
              unoptimized
            />
          </div>
          <FeatureCard index={0} className="top-1/2 right-0 translate-x-[10%] w-80" />
          <FeatureCard
            index={4}
            className="bottom-0 translate-x-[-10%] translate-y-[10%] w-70"
          />
        </div>
      </div>

      {/* App Screenshot 2 */}
      <div className="mt-40 bg-muted py-10 sm:py-32 xl:px-40 lg:px-30 md:px-20 px-10 flex flex-col gap-12">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-3xl font-bold">
            Ready to get finally finish your projects ?
          </h2>
          <p className="text-xl opacity-90">
            Start managing your{' '}
            <span className="font-cursive italic">creative / work / life</span> projects
            today. It&apos;s free and takes less than a minute to get started.
          </p>
        </div>
        <div className="mx-auto flex flex-col gap-4 relative">
          <div className="rounded-xl border bg-card overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow border-white border-2">
            <Image
              src="/lp-1.png"
              alt="Project Manager Screenshot 2"
              width={800}
              height={600}
              className="w-full h-auto"
              priority
              unoptimized
            />
          </div>
          <FeatureCard index={2} className="top-3/5 right-0 translate-x-[10%]" />
          <FeatureCard index={3} className="bottom-2/5 translate-x-[-10%]" />
          <FeatureCard index={1} className="bottom-[10%] left-2/5 w-70" />
        </div>
      </div>
    </section>
  );
}
