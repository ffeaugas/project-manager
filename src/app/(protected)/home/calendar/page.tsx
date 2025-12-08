'use client';

import { useState, useEffect } from 'react';
import { DayCard, NoDayCard } from '@/components/calendar/DayCard';
import CalendarEventSheet from '@/components/calendar/CalendarEventSheet';
import { useCalendar } from '@/hooks/use-calendar';
import { CalendarEvent } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, HomeIcon, Calendar } from 'lucide-react';
import Header from '@/components/common/Header';
import { ReactNode } from 'react';
import PageBreadcrumbs from '@/components/common/PageBreadcrumbs';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [monthYearLabel, setMonthYearLabel] = useState<string>('');

  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();

  useEffect(() => {
    setMonthYearLabel(
      new Date(currentYear, currentMonth).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      }),
    );
  }, [currentYear, currentMonth]);

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

  const breadcrumbs = (
    <PageBreadcrumbs
      items={[
        {
          label: 'Home',
          href: '/home',
          icon: HomeIcon,
        },
        {
          label: 'Calendar',
          icon: Calendar,
        },
      ]}
    />
  );

  return (
    <div className="flex flex-col w-full h-dvh overflow-y-auto bg-dotted">
      <CalendarHeader
        monthYearLabel={monthYearLabel}
        currentYear={currentYear}
        currentMonth={currentMonth}
        handlePreviousMonth={handlePreviousMonth}
        handleNextMonth={handleNextMonth}
        breadcrumbs={breadcrumbs}
      />
      <div className="flex flex-row lg:gap-2 gap-1 w-full">
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
    <div className="flex flex-col lg:gap-2 gap-1 flex-1">
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

interface ICalendarHeaderProps {
  monthYearLabel: string;
  currentYear: number;
  currentMonth: number;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  breadcrumbs?: ReactNode;
}

const CalendarHeader = ({
  monthYearLabel,
  currentYear,
  currentMonth,
  handlePreviousMonth,
  handleNextMonth,
  breadcrumbs,
}: ICalendarHeaderProps) => {
  return (
    <Header>
      <div className="flex items-center justify-between w-full">
        {breadcrumbs && <div>{breadcrumbs}</div>}
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePreviousMonth}
            variant="ghost"
            size="icon"
            className="bg-muted border-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {monthYearLabel ||
              `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`}
          </h1>
          <Button
            onClick={handleNextMonth}
            variant="ghost"
            size="icon"
            className="bg-muted border-border"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Header>
  );
};
