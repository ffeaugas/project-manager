'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import { CalendarEvent } from '@prisma/client';
import { NewCalendarEventType, UpdateCalendarEventType } from '@/app/api/calendar/types';
import ExtendedDayCard from './ExtendedDayCard';
import CalendarEventForm from './CalendarEventForm';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface ICalendarEventSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  event: CalendarEvent | null;
  events: CalendarEvent[];
  createEvent: (data: NewCalendarEventType) => Promise<boolean>;
  updateEvent: (
    id: string,
    data: Omit<UpdateCalendarEventType, 'id'>,
  ) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
}

const CalendarEventSheet = ({
  isOpen,
  onOpenChange,
  selectedDate,
  event: initialEvent,
  events,
  createEvent,
  updateEvent,
  deleteEvent,
}: ICalendarEventSheetProps) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(initialEvent);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setSelectedEvent(initialEvent);
      setShowForm(true);
    } else {
      setSelectedEvent(null);
      setShowForm(false);
    }
  }, [initialEvent]);

  const handleClose = () => {
    onOpenChange(false);
    setSelectedEvent(null);
    setShowForm(false);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleNewEventClick = () => {
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleFormSuccess = (open: boolean) => {
    if (!open) {
      setShowForm(false);
      setSelectedEvent(null);
    }
  };

  const getTitle = () => {
    if (selectedDate) {
      return selectedDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'Calendar Events';
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="bg-zinc-900 w-full sm:max-w-xl overflow-y-auto"
      >
        <SheetTitle className="sr-only">{getTitle()}</SheetTitle>
        <ExtendedDayCard
          date={selectedDate}
          events={events}
          onEventClick={handleEventClick}
        />

        {!showForm && (
          <div className="mt-4">
            <Button
              onClick={handleNewEventClick}
              variant="outline"
              className="w-full h-[80px] bg-transparent border-dashed
        border-2 border-zinc-700 p-4 text-zinc-600 text-lg md:text-md my-[1px] mt-[.6rem]"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </div>
        )}

        {showForm && (
          <div className="mt-6">
            <CalendarEventForm
              event={selectedEvent}
              selectedDate={selectedDate}
              createEvent={createEvent}
              updateEvent={updateEvent}
              deleteEvent={deleteEvent}
              onOpenChange={handleFormSuccess}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CalendarEventSheet;
