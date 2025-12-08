'use client';

import Header from '@/components/common/Header';
import PageBreadcrumbs from '@/components/common/PageBreadcrumbs';
import { HomeIcon, Archive } from 'lucide-react';

export default function ArchivesPage() {
  const breadcrumbs = (
    <PageBreadcrumbs
      items={[
        {
          label: 'Home',
          href: '/home',
          icon: HomeIcon,
        },
        {
          label: 'Archives',
          icon: Archive,
        },
      ]}
    />
  );

  return (
    <div className="flex flex-col w-full h-dvh overflow-y-auto">
      <Header>
        <div className="flex items-center">{breadcrumbs}</div>
      </Header>
      <div className="p-4">ArchivesPage</div>
    </div>
  );
}
