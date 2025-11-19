'use client';

import { CalendarEvent } from '@prisma/client';

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
      <h2 className="text-2xl font-bold text-white mb-4">{formatDate(date)}</h2>
      <div className="space-y-2">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 cursor-pointer transition-colors border-[1px] border-blue-500"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {event.startTime && (
                    <p className="text-sm font-semibold text-white mb-1">
                      {formatTime(event.startTime)}
                      {event.duration && (
                        <span className="text-xs font-normal text-blue-100 ml-2">
                          ({event.duration} min)
                        </span>
                      )}
                    </p>
                  )}
                  <p className="text-sm text-white break-words">
                    {event.description.length > 110
                      ? event.description.slice(0, 110) + '...'
                      : event.description}
                  </p>
                </div>
              </div>
            </div>
          ))
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
