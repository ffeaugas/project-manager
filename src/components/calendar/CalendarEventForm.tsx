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
    formState: { errors },
  } = useForm<NewCalendarEventType>({
    defaultValues: {
      description: event?.description || '',
      date: selectedDate
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : '',
      startTime: event?.startTime || undefined,
      duration: event?.duration || undefined,
    },
    resolver: zodResolver(NewCalendarEventSchema),
  });

  const onSubmit: SubmitHandler<NewCalendarEventType> = async (bodyData) => {
    console.log('✅ Validated Form Data:', bodyData);
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
        <SheetTitle className="text-white">
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
            className="w-full bg-zinc-800 text-white resize-none"
            rows={3}
          />
          {errors.description && (
            <span className="text-right text-red-500 text-sm">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="items-center gap-4">
          <Label htmlFor="date">Date</Label>
          <Input
            {...register('date')}
            id="date"
            type="date"
            className="w-full bg-zinc-800 text-white"
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
              className="bg-zinc-800 text-white"
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
              className="bg-zinc-800 text-white"
              placeholder="60"
            />
            {errors.duration && (
              <span className="text-right text-red-500 text-sm">
                {errors.duration.message}
              </span>
            )}
          </div>
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
