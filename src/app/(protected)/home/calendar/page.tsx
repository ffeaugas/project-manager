'use client';

import { useState } from 'react';
import { DayCard, NoDayCard } from '@/components/calendar/DayCard';
import CalendarEventSheet from '@/components/calendar/CalendarEventSheet';
import { useCalendar } from '@/hooks/use-calendar';
import { CalendarEvent } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const daysArray: Array<{
    date?: Date;
    weekDayIndex: number;
    events?: CalendarEvent[];
    isEmpty?: boolean;
  }> = Array.from({ length: daysInMonth }, (_, idx) => {
    const date = new Date(currentYear, currentMonth, idx + 1);
    return {
      date,
      weekDayIndex: date.getDay(),
      events: events.filter(
        (event) => new Date(event.date).toDateString() === date.toDateString(),
      ),
    };
  });

  if (firstDayIndex > 0) {
    const emptyDays = Array.from({ length: firstDayIndex }, (_, idx) => ({
      isEmpty: true,
      weekDayIndex: idx,
    }));
    daysArray.unshift(...emptyDays);
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsSheetOpen(true);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={handlePreviousMonth}
          variant="outline"
          size="icon"
          className="bg-zinc-900 border-zinc-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-white">
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h1>
        <Button
          onClick={handleNextMonth}
          variant="outline"
          size="icon"
          className="bg-zinc-900 border-zinc-700"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-row gap-2 w-full">
        {weekDays.map((weekDay, index) => (
          <WeekDayColumn
            key={weekDay}
            weekDayIndex={index}
            days={daysArray.filter((day) => day.weekDayIndex === index)}
            onDayClick={handleDayClick}
          />
        ))}
      </div>

      <CalendarEventSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedDate={selectedDate}
        event={selectedEvent}
        events={events}
        createEvent={createEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
      />
    </div>
  );
};

export default CalendarPage;

interface IWeekDayColumnProps {
  weekDayIndex: number;
  days: Array<{
    date?: Date;
    weekDayIndex: number;
    events?: CalendarEvent[];
    isEmpty?: boolean;
  }>;
  onDayClick: (date: Date) => void;
}

const WeekDayColumn = ({ weekDayIndex, days, onDayClick }: IWeekDayColumnProps) => {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <h1 className="text-sm font-semibold text-zinc-400">{weekDays[weekDayIndex]}</h1>
      {days.length === 0 ? (
        <NoDayCard />
      ) : (
        days.map((day) => {
          if (day.isEmpty) {
            return <NoDayCard key={`empty-${day.weekDayIndex}`} />;
          }
          return (
            <DayCard
              key={day.date!.toISOString()}
              date={day.date!}
              events={day.events || []}
              onClick={() => onDayClick(day.date!)}
            />
          );
        })
      )}
    </div>
  );
};
