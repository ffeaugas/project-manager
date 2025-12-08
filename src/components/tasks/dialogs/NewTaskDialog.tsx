'use client';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { DialogFooter, DialogHeader } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  newTaskSchema,
  NewTaskType,
  TaskSelect,
} from '../../../app/api/columns/tasks/types';
import { useEffect, useState } from 'react';
import { Archive, Trash } from 'lucide-react';
import ConfirmDialog from '../../utils/ConfirmDialog';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface INewTaskDialogProps {
  createTask: (bodyData: Omit<NewTaskType, 'id'>, columnId: string) => Promise<boolean>;
  updateTask: (
    taskId: string,
    bodyData: Omit<NewTaskType, 'id'>,
    columnId?: string,
  ) => Promise<boolean>;
  deleteItem?: (id: string, route: string) => Promise<boolean>;
  archiveItem?: (id: string) => Promise<boolean>;
  children: React.ReactNode;
  data?: TaskSelect | null;
  columnId: string;
}

const NewTaskDialog = ({
  createTask,
  updateTask,
  deleteItem,
  children,
  data = null,
  columnId,
  archiveItem,
}: INewTaskDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewTaskType>({
    defaultValues: { title: data?.title || '', description: data?.description || '' },
    resolver: zodResolver(newTaskSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: data?.title || '',
        description: data?.description || '',
      });
    }
  }, [isOpen, data, reset]);

  const onSubmit: SubmitHandler<NewTaskType> = async (bodyData) => {
    const submitData = {
      ...bodyData,
      description: bodyData.description?.trim() || undefined,
    };

    const success = data
      ? await updateTask(data.id, submitData, columnId)
      : await createTask(submitData, columnId);

    if (success) {
      if (data) reset();
      setIsOpen(false);
    } else {
      toast.error(
        'An error occurred. Please try again or contact support if the problem persists.',
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full h-dvh md:h-auto md:max-w-[625px] bg-card overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{data ? 'Edit' : 'Add a new'} task</DialogTitle>
            <DialogDescription>
              {data ? 'Edit' : 'Add a new'} task and its description. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input {...register('title')} id="title" />
            </div>
            <div className="items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                {...register('description')}
                id="description"
                className="resize-none"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-end gap-2">
            {data && deleteItem && archiveItem && (
              <>
                <ConfirmDialog
                  id={data.id}
                  route="columns/tasks/archive"
                  title="Archive this task ?"
                  message="Are you sure you want to archive this task ? You will be able to find it in the archived tasks section."
                  confirmLabel="Archive"
                  action={archiveItem}
                  onSuccess={() => {
                    setIsOpen(false);
                  }}
                >
                  <Button className="bg-transparent border-zinc-500/50 border-2 p-2 hover:bg-transparent hover:border-zinc-500">
                    <Archive color="#737373" size={20} />
                  </Button>
                </ConfirmDialog>
                <ConfirmDialog
                  id={data.id}
                  route="columns/tasks"
                  title="Delete this task ?"
                  message="Are you sure you want to delete this task ? This action cannot be undone."
                  confirmLabel="Delete"
                  action={deleteItem}
                  onSuccess={() => {
                    setIsOpen(false);
                  }}
                >
                  <Button className="bg-transparent border-red-900/50 border-2 p-2 hover:bg-transparent hover:border-red-900">
                    <Trash color="#AA0000" size={20} />
                  </Button>
                </ConfirmDialog>
              </>
            )}
            <Button type="submit" isSubmitting={isSubmitting}>
              Save{!data && ' task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
