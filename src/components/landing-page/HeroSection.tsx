import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LANDING_PAGE_CONTENT } from '@/const/landing-page-content';
import { ArrowRight } from 'lucide-react';
import Eye from '@/components/landing-page/eye';
import FeatureCard from './FeatureCard';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-32 bg-dotted-transparent">
      <div className="absolute inset-0" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center gap-2 justify-center translate-x-[-40px] flex-row">
            <Eye />
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight font-cursive">
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
            <Image
              src="/start-monster-white.png"
              alt="Project Manager Logo"
              width={180}
              height={180}
              className="absolute left-[-70px] bottom-[-140px]"
            />
          </div>
        </div>

        {/* App Screenshots */}
        <div className="mt-40 max-w-6xl mx-auto flex flex-col gap-4 relative">
          <Image
            src="/transparent-monster-white.png"
            alt="Project Manager Logo"
            width={170}
            height={170}
            className="absolute top-0 right-20 translate-y-[-100%]"
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
          <FeatureCard
            index={0}
            className="top-[10%] scale-50 left-1/2 translate-x-[40%]"
          />
          <FeatureCard
            index={1}
            className="scale-60 bottom-0 translate-x-[-30%] -translate-y-[-50%]"
          />
        </div>
      </div>
    </section>
  );
}
