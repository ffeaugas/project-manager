'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { CalendarEvent } from '@prisma/client';
import { NewCalendarEventType, UpdateCalendarEventType } from '@/app/api/calendar/types';
import { NewCalendarEventSchema } from '@/app/api/calendar/types';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmDialog from '../utils/ConfirmDialog';
import {
  CALENDAR_EVENT_CATEGORIES,
  type CalendarEventCategoryKey,
} from '@/const/categories';
import { cn } from '@/lib/utils';

interface ICalendarEventFormProps {
  event: CalendarEvent | null;
  selectedDate: Date | null;
  createEvent: (data: NewCalendarEventType) => Promise<boolean>;
  updateEvent: (
    id: string,
    data: Omit<UpdateCalendarEventType, 'id'>,
  ) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  onOpenChange: (open: boolean) => void;
}

const CalendarEventForm = ({
  event,
  selectedDate,
  createEvent,
  updateEvent,
  deleteEvent,
  onOpenChange,
}: ICalendarEventFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewCalendarEventType>({
    defaultValues: {
      description: event?.description || '',
      date: selectedDate
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : '',
      startTime: event?.startTime || undefined,
      duration: event?.duration || undefined,
      category: (event?.category as CalendarEventCategoryKey) || 'default',
    },
    resolver: zodResolver(NewCalendarEventSchema),
  });

  const selectedCategory = watch('category') || 'default';

  const onSubmit: SubmitHandler<NewCalendarEventType> = async (bodyData) => {
    setIsLoading(true);
    try {
      if (event) {
        const success = await updateEvent(event.id, bodyData);
        if (success) {
          toast.success('Event updated successfully');
          reset();
          onOpenChange(false);
        }
      } else {
        const success = await createEvent(bodyData);
        if (success) {
          toast.success('Event created successfully');
          reset();
          onOpenChange(false);
        }
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await deleteEvent(id);
      if (success) {
        toast.success('Event deleted successfully');
        reset();
        onOpenChange(false);
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SheetHeader>
        <SheetTitle className="text-foreground">
          {event ? 'Edit event' : 'New event'}
        </SheetTitle>
        <SheetDescription className="text-zinc-400">
          {event ? 'Edit' : 'Create'} your event details below.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-4 py-4">
        <div className="items-center gap-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            {...register('description')}
            id="description"
            className="w-full bg-background text-foreground resize-none"
            rows={3}
          />
          {errors.description && (
            <span className="text-right text-red-500 text-sm">
              {errors.description.message}
            </span>
          )}
        </div>

        <input type="hidden" {...register('category')} />

        <div className="items-center gap-4">
          <Label htmlFor="date">Date</Label>
          <Input
            {...register('date')}
            id="date"
            type="date"
            className="w-full bg-background text-foreground"
          />
          {errors.date && (
            <span className="text-right text-red-500 text-sm">{errors.date.message}</span>
          )}
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="items-center gap-4 flex-1">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              {...register('startTime')}
              id="startTime"
              type="time"
              className="bg-background text-foreground"
            />
            {errors.startTime && (
              <span className="text-right text-red-500 text-sm">
                {errors.startTime.message}
              </span>
            )}
          </div>
          <div className="items-center gap-4 flex-1">
            <Label htmlFor="duration">Duration (min)</Label>
            <Input
              {...register('duration')}
              id="duration"
              type="number"
              className="bg-background text-foreground"
              placeholder="0"
            />
            {errors.duration && (
              <span className="text-right text-red-500 text-sm">
                {errors.duration.message}
              </span>
            )}
          </div>
        </div>

        <div className="items-center gap-4">
          <Label>Category</Label>
          <div className="flex flex-row gap-2 flex-wrap">
            {Object.values(CALENDAR_EVENT_CATEGORIES).map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setValue('category', category.key)}
                  className={cn(
                    'w-10 h-10 rounded-md flex items-center justify-center transition-all',
                    'border-2 hover:scale-110',
                    isSelected
                      ? 'border-foreground shadow-lg scale-110'
                      : 'border-transparent hover:border-foreground/50',
                  )}
                  style={{
                    backgroundColor: category.color,
                  }}
                  aria-label={category.name}
                >
                  <Icon
                    size={20}
                    className={cn(
                      'text-white',
                      isSelected ? 'opacity-100' : 'opacity-80',
                    )}
                  />
                </button>
              );
            })}
          </div>
          {errors.category && (
            <span className="text-right text-red-500 text-sm">
              {errors.category.message}
            </span>
          )}
        </div>
      </div>

      <SheetFooter className="flex flex-row justify-between">
        <div>
          {event && (
            <ConfirmDialog
              id={event.id}
              title="Delete this event?"
              message="Are you sure you want to delete this event? This action cannot be undone."
              confirmLabel="Delete"
              action={handleDelete}
              route=""
            >
              <Button
                type="button"
                variant="destructive"
                className="bg-transparent border-red-900/50 border-2 p-2 hover:bg-transparent hover:border-red-900"
              >
                <Trash color="#AA0000" size={20} />
              </Button>
            </ConfirmDialog>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Save{!event && ' event'}
          </Button>
        </div>
      </SheetFooter>
    </form>
  );
};

export default CalendarEventForm;
