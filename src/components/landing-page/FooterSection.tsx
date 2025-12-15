import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LANDING_PAGE_CONTENT } from '@/const/landing-page-content';

export function FooterSection() {
  return (
    <footer className="border-t py-8 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 {LANDING_PAGE_CONTENT.title}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
