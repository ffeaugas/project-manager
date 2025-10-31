'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '../ui/sheet';
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
      startTime: event?.startTime || '',
      duration: event?.duration || undefined,
    },
    resolver: zodResolver(NewCalendarEventSchema),
  });

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
    } catch (error) {
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
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="bg-zinc-900 w-full sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle className="text-white">
              {event ? 'Edit event' : 'New event'}
            </SheetTitle>
            <SheetDescription className="text-zinc-400">
              {event ? 'Edit' : 'Create'} your event details below.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-white">
                Description
              </Label>
              <Textarea
                {...register('description')}
                id="description"
                className="col-span-3 bg-zinc-800 text-white resize-none"
                rows={3}
              />
              {errors.description && (
                <span className="col-span-4 text-right text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right text-white">
                Date
              </Label>
              <Input
                {...register('date')}
                id="date"
                type="date"
                className="col-span-3 bg-zinc-800 text-white"
              />
              {errors.date && (
                <span className="col-span-4 text-right text-red-500 text-sm">
                  {errors.date.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right text-white">
                Start Time
              </Label>
              <Input
                {...register('startTime')}
                id="startTime"
                type="time"
                className="col-span-3 bg-zinc-800 text-white"
              />
              {errors.startTime && (
                <span className="col-span-4 text-right text-red-500 text-sm">
                  {errors.startTime.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right text-white">
                Duration (min)
              </Label>
              <Input
                {...register('duration', { valueAsNumber: true })}
                id="duration"
                type="number"
                className="col-span-3 bg-zinc-800 text-white"
                placeholder="60"
              />
              {errors.duration && (
                <span className="col-span-4 text-right text-red-500 text-sm">
                  {errors.duration.message}
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
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isLoading}>
                Save{!event && ' event'}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CalendarEventSheet;
