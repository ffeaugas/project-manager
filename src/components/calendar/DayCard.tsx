import { CalendarEvent } from '@prisma/client';
import { CALENDAR_EVENT_CATEGORIES, CalendarEventCategoryKey } from '@/const/categories';
import { cn } from '@/lib/utils';

interface IDayCardProps {
  date: Date;
  events: CalendarEvent[];
  onClick?: () => void;
  className?: string;
}

export const DayCard = ({ date, events, onClick, className }: IDayCardProps) => {
  const filteredEvents = events.filter(
    (event) => new Date(event.date).toDateString() === date.toDateString(),
  );
  return (
    <div
      className={cn(
        'min-w-[100px] max-w-[300px] bg-background2 rounded-sm h-[200px] cursor-pointer hover:bg-background transition-colors border flex-1',
        className,
      )}
      onClick={onClick}
    >
      <h1 className="text-foreground text-md font-bold p-1">{date.getDate()}</h1>
      {filteredEvents.length > 0 && (
        <div className="space-y-1 w-full flex flex-col justify-center">
          {filteredEvents.slice(0, 3).map((event) => {
            return <EventCard event={event} key={event.id} />;
          })}
          {filteredEvents.length > 3 && (
            <p className="text-xs text-zinc-400 text-center">
              +{filteredEvents.length - 3} more
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const NoDayCard = () => {
  return <div className="w-full h-[200px]" />;
};

interface IEventCardProps {
  event: CalendarEvent;
}

const EventCard = ({ event }: IEventCardProps) => {
  const category = CALENDAR_EVENT_CATEGORIES[event.category as CalendarEventCategoryKey];

  const categoryColor = category?.color || CALENDAR_EVENT_CATEGORIES.default.color;
  return (
    <div
      key={event.id}
      className="px-2 py-1"
      style={{
        background: `linear-gradient(125deg, transparent, ${categoryColor})`,
      }}
    >
      {event.startTime && (
        <p className="text-xs font-semibold text-foreground">{event.startTime}</p>
      )}
      <p className="text-xs text-foreground truncate">
        {event.description.length > 25
          ? event.description.slice(0, 25) + '...'
          : event.description}
      </p>
    </div>
  );
};
