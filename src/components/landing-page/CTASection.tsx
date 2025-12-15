import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 sm:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-3xl font-bold">
            Ready to get finally finish your projects ?
          </h2>
          <p className="text-xl opacity-90">
            Start managing your{' '}
            <span className="font-cursive italic">creative / work / life</span>{' '}
            projects today. It&apos;s free and takes less than a minute to get
            started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link href="/auth/signup">
                Get started for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

