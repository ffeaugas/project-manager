'use client';

import { CalendarEvent } from '@prisma/client';
import { CALENDAR_EVENT_CATEGORIES } from '@/const/categories';
import { CalendarEventCategoryKey } from '@prisma/client';
interface IExtendedDayCardProps {
  date: Date | null;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const ExtendedDayCard = ({ date, events, onEventClick }: IExtendedDayCardProps) => {
  if (!date) return null;

  const filteredEvents = events
    .filter((event) => new Date(event.date).toDateString() === date.toDateString())
    .sort((a, b) => {
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string | null) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">{formatDate(date)}</h2>
      <div className="space-y-2">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const category =
              CALENDAR_EVENT_CATEGORIES[event.category as CalendarEventCategoryKey];
            const categoryColor =
              category?.color || CALENDAR_EVENT_CATEGORIES.default.color;
            return (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="rounded-lg p-3 cursor-pointer transition-all hover:opacity-70 border-2"
                style={{
                  background: `linear-gradient(90deg, transparent 1%, ${categoryColor})`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {event.startTime && (
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {formatTime(event.startTime)}
                        {event.duration && (
                          <span className="text-xs font-normal text-muted-foreground ml-2">
                            ({event.duration} min)
                          </span>
                        )}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-3 break-all">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-zinc-400">
            <p>No events scheduled for this day</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtendedDayCard;
