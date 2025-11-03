import CalendarSection from '@/components/calendar/CalendarSection';
import Kanban from '@/components/tasks/Kanban';

const HomePage = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col-reverse md:flex-row h-dvh">
        <Kanban />
        <CalendarSection />
      </div>
    </div>
  );
};

export default HomePage;
