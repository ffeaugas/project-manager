import { CalendarEvent } from '@prisma/client';

interface IDayCardProps {
  date: Date;
  events: CalendarEvent[];
  onClick?: () => void;
}

export const DayCard = ({ date, events, onClick }: IDayCardProps) => {
  const filteredEvents = events.filter(
    (event) => new Date(event.date).toDateString() === date.toDateString(),
  );
  return (
    <div
      className="w-full bg-zinc-800 rounded-lg h-[200px] cursor-pointer hover:bg-zinc-700 transition-colors border-[1px] border-black"
      onClick={onClick}
    >
      <h1 className="text-white text-lg font-bold p-2">{date.getDate()}</h1>
      {filteredEvents.length > 0 && (
        <div className="space-y-1">
          {filteredEvents.slice(0, 3).map((event) => (
            <div key={event.id} className="bg-blue-600 px-2 py-1">
              {event.startTime && (
                <p className="text-xs font-semibold text-white">{event.startTime}</p>
              )}
              <p className="text-xs text-white truncate">
                {event.description.length > 25
                  ? event.description.slice(0, 25) + '...'
                  : event.description}
              </p>
            </div>
          ))}
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
