'use client';

import PageBreadcrumbs from '@/components/common/PageBreadcrumbs';
import { HomeIcon, Archive } from 'lucide-react';
import ArchivedTasksList from '@/components/tasks/ArchivedTasksList';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import ActivitySection from '@/components/activity/ActivitySection';
import CalendarSection from '@/components/calendar/CalendarSection';
import { useState } from 'react';

export default function ArchivesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex flex-col w-full h-dvh overflow-y-auto bg-dotted">
      <div className="flex flex-col-reverse md:flex-row">
        <ResizablePanelGroup direction="horizontal" className="w-full flex bg-dotted">
          <ResizablePanel minSize={60} defaultSize={80}>
            <ArchivedTasksList breadcrumbs={breadcrumbs} />
          </ResizablePanel>
          <ResizableHandle withHandle className="hidden md:flex" />
          <ResizablePanel
            minSize={15}
            defaultSize={20}
            className="hidden md:block min-w-[200px]"
          >
            <div className="w-full md:h-dvh border-l border-border md:flex flex-col gap-2 p-2 bg-card hidden">
              <CalendarSection />
              <ActivitySection />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className="bg-card w-full overflow-y-auto">
          <SheetTitle />
          <div className="flex flex-col gap-4 mt-6">
            <CalendarSection />
            <ActivitySection />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
