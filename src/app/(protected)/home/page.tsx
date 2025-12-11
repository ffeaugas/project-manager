'use client';

import ActivitySection from '@/components/activity/ActivitySection';
import CalendarSection from '@/components/calendar/CalendarSection';
import Kanban from '@/components/tasks/Kanban';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import PageBreadcrumbs from '@/components/common/PageBreadcrumbs';
import { HomeIcon } from 'lucide-react';

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const breadcrumbs = (
    <PageBreadcrumbs
      items={[
        {
          label: 'Home',
          href: '/home',
          icon: HomeIcon,
        },
      ]}
    />
  );

  return (
    <div className="flex flex-col w-full h-dvh overflow-y-auto bg-dotted">
      <div className="flex flex-col-reverse md:flex-row">
        <ResizablePanelGroup direction="horizontal" className="w-full flex bg-dotted">
          <ResizablePanel minSize={60} defaultSize={80}>
            <Kanban
              openSidebar={() => setIsSidebarOpen(true)}
              breadcrumbs={breadcrumbs}
            />
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
};

export default HomePage;
