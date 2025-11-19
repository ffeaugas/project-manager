'use client';

import { Sheet, SheetContent } from '../ui/sheet';
import { CalendarEvent } from '@prisma/client';
import { NewCalendarEventType, UpdateCalendarEventType } from '@/app/api/calendar/types';
import ExtendedDayCard from './ExtendedDayCard';
import CalendarEventForm from './CalendarEventForm';

interface ICalendarEventSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  event: CalendarEvent | null;
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
  event,
  createEvent,
  updateEvent,
  deleteEvent,
}: ICalendarEventSheetProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="bg-zinc-900 w-full sm:max-w-xl">
        <ExtendedDayCard />
        <CalendarEventForm
          event={event}
          selectedDate={selectedDate}
          createEvent={createEvent}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
          onOpenChange={onOpenChange}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CalendarEventSheet;
