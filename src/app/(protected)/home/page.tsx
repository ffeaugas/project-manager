import ActivitySection from '@/components/activity/ActivitySection';
import CalendarSection from '@/components/calendar/CalendarSection';
import Kanban from '@/components/tasks/Kanban';

const HomePage = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col-reverse md:flex-row h-dvh">
        <Kanban />
        <div className="w-full md:w-[400px] md:h-dvh border-l border-zinc-700 flex flex-col gap-2 p-2 bg-zinc-900 md:block hidden">
          <CalendarSection />
          <ActivitySection />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
