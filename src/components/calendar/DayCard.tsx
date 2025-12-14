import { CalendarEvent } from '@/app/api/calendar/service';
import { CALENDAR_EVENT_CATEGORIES } from '@/const/categories';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cva } from 'class-variance-authority';

interface IDayCardProps {
  date: Date;
  events: CalendarEvent[];
  onClick?: () => void;
  variant?: 'fullPage' | 'section';
  isToday?: boolean;
}

const cardVariants = cva(
  'rounded-sm h-[200px] cursor-pointer hover:bg-background transition-colors shadow-xl',
  {
    variants: {
      variant: {
        fullPage:
          'flex-1 text-xs xl:text-sm lg:min-h-[200px] lg:max-h-[200px] min-h-[100px] max-h-[100px]',
        section: 'flex-1 min-w-[150px]',
      },
    },
  },
);

export const DayCard = ({
  date,
  events,
  onClick,
  variant = 'fullPage',
  isToday = false,
}: IDayCardProps) => {
  const filteredEvents = events.filter(
    (event) => new Date(event.date).toDateString() === date.toDateString(),
  );

  const truncatedEvents = filteredEvents.slice(0, 3);
  const sortedEvents = truncatedEvents.sort((a: CalendarEvent, b: CalendarEvent) => {
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <Card
      className={cn(
        cardVariants({ variant }),
        isToday && 'border-2 border-primary bg-primary/5',
      )}
      onClick={onClick}
    >
      <CardHeader className="p-1">
        <h1
          className={cn(
            'text-md font-bold',
            isToday ? 'text-primary' : 'text-foreground',
          )}
        >
          {date.getDate()}
        </h1>
      </CardHeader>
      {sortedEvents.length > 0 && (
        <CardContent className="space-y-1 w-full flex flex-col justify-center py-2 lg:px-0 px-2 pt-0">
          {sortedEvents.map((event) => {
            return <EventCard event={event} key={event.id} variant={variant} />;
          })}
          {sortedEvents.length > 3 && (
            <p className="text-xs text-zinc-400 text-center">
              +{sortedEvents.length - 3}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export const NoDayCard = () => {
  return <div className="w-full lg:h-[200px] h-[100px]" />;
};

interface IEventCardProps {
  event: CalendarEvent;
  variant?: 'fullPage' | 'section';
}

const EventCard = ({ event, variant = 'fullPage' }: IEventCardProps) => {
  const category = CALENDAR_EVENT_CATEGORIES[event.category];

  const categoryColor = category?.color || CALENDAR_EVENT_CATEGORIES.default.color;

  const minimalVersion = (
    <span
      className="w-3 h-3 rounded-full lg:hidden"
      style={{ backgroundColor: categoryColor }}
    />
  );

  const fullVersion = (
    <Card
      key={event.id}
      className={cn(
        'px-2 py-1 border-0 shadow-none rounded-none',
        variant === 'fullPage' && 'hidden lg:block',
      )}
      style={{
        background: `linear-gradient(125deg, transparent, ${categoryColor})`,
      }}
    >
      {event.startTime && (
        <p className="text-xs font-semibold text-foreground">{event.startTime}</p>
      )}
      <p className="text-xs text-foreground line-clamp-1">{event.description}</p>
    </Card>
  );

  if (variant === 'fullPage') {
    return (
      <>
        {minimalVersion}
        {fullVersion}
      </>
    );
  }

  return fullVersion;
};
