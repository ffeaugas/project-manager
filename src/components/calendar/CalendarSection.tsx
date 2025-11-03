'use client';

import { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { DayCard } from './DayCard';
import Link from 'next/link';
import { useCalendar } from '@/hooks/use-calendar';
import CalendarEventSheet from './CalendarEventSheet';
import { CalendarEvent } from '@prisma/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const CalendarSection = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();
  const isMobile = useIsMobile();

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
    <div className="w-full md:w-[400px] md:h-dvh border-l border-zinc-700 flex flex-col gap-2 p-2 bg-zinc-900">
      <div className="flex flex-row items-center justify-between">
        <Link href="/home/calendar">
          <CalendarDays size={20} className="cursor-pointer" />
        </Link>
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              size={20}
              className={cn(
                'cursor-pointer transition-transform duration-200',
                isExpanded ? 'rotate-0' : 'rotate-180',
              )}
            />
          </Button>
        )}
      </div>
      {(!isMobile || isExpanded) && (
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
      )}

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
