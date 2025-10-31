import CalendarSection from '@/components/calendar/CalendarSection';
import Kanban from '@/components/tasks/Kanban';

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen max-h-screen w-full">
      <div className="flex flex-row h-full">
        <Kanban />
        <CalendarSection />
      </div>
    </div>
  );
};

export default HomePage;
