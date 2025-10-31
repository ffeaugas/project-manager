'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { DayCard } from './DayCard';
import Link from 'next/link';
import { useCalendar } from '@/hooks/use-calendar';
import CalendarEventSheet from './CalendarEventSheet';
import { CalendarEvent } from '@prisma/client';

const CalendarSection = () => {
  const today = new Date();
  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsSheetOpen(true);
  };

  const todayEvents = events.filter(
    (event) => new Date(event.date).toDateString() === today.toDateString(),
  );
  const tomorrowEvents = events.filter(
    (event) =>
      new Date(event.date).toDateString() ===
      new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString(),
  );

  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  return (
    <div className="w-[400px] h-screen border-l border-zinc-700 flex flex-col gap-2 p-2">
      <Link href="/home/calendar">
        <CalendarDays size={20} className="cursor-pointer" />
      </Link>
      <div className="flex flex-row gap-2">
        <DayCard
          date={today}
          events={todayEvents}
          onClick={() => handleDayClick(today)}
        />
        <DayCard
          date={tomorrow}
          events={tomorrowEvents}
          onClick={() => handleDayClick(tomorrow)}
        />
      </div>

      <CalendarEventSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedDate={selectedDate}
        event={selectedEvent}
        createEvent={createEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
      />
    </div>
  );
};

export default CalendarSection;
