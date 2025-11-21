import ActivitySection from '@/components/activity/ActivitySection';
import CalendarSection from '@/components/calendar/CalendarSection';
import Kanban from '@/components/tasks/Kanban';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

const HomePage = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col-reverse md:flex-row h-dvh">
        <ResizablePanelGroup direction="horizontal" className="w-full flex">
          <ResizablePanel minSize={60} defaultSize={80}>
            <Kanban />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={15}>
            <div className="w-full md:h-dvh border-l border-zinc-700 md:flex flex-col gap-2 p-2 bg-zinc-900 hidden">
              <CalendarSection />
              <ActivitySection />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default HomePage;
