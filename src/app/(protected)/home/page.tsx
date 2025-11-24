'use client';

import ActivitySection from '@/components/activity/ActivitySection';
import CalendarSection from '@/components/calendar/CalendarSection';
import Kanban from '@/components/tasks/Kanban';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useState } from 'react';

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col w-full h-dvh overflow-y-auto">
      <div className="flex flex-col-reverse md:flex-row">
        <ResizablePanelGroup direction="horizontal" className="w-full flex bg-dotted">
          <ResizablePanel minSize={60} defaultSize={80}>
            <Kanban openSidebar={() => setIsSidebarOpen(true)} />
          </ResizablePanel>
          <ResizableHandle withHandle className="hidden md:flex" />
          <ResizablePanel minSize={15} className="hidden md:block">
            <div className="w-full md:h-dvh border-l border-borderColor md:flex flex-col gap-2 p-2 bg-background2 hidden">
              <CalendarSection />
              <ActivitySection />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className="bg-background2 w-full overflow-y-auto">
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
