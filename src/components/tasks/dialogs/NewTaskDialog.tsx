'use client';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newTaskSchema, NewTaskType, Task } from '../../../app/api/columns/tasks/types';
import { useEffect, useState } from 'react';
import { Archive, Trash, Edit } from 'lucide-react';
import ConfirmDialog from '../../utils/ConfirmDialog';
import { toast } from 'sonner';
import TaskForm from './TaskForm';

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
  data?: Task | null;
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
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewTaskType>({
    defaultValues: { title: data?.title || '', description: data?.description || '' },
    resolver: zodResolver(newTaskSchema),
  });

  const isArchived = data?.archivedAt != null;

  useEffect(() => {
    if (isOpen) {
      setIsEditing(!data);
      reset({
        title: data?.title || '',
        description: data?.description || '',
      });
    }
  }, [isOpen, data, reset, isArchived]);

  const onSubmit: SubmitHandler<NewTaskType> = async (bodyData) => {
    const submitData = {
      ...bodyData,
      description: bodyData.description.trim() || '',
    };

    const success = data
      ? await updateTask(data.id, submitData, columnId)
      : await createTask(submitData, columnId);

    if (success) {
      setIsEditing(false);
      if (data) reset();
      setIsOpen(false);
    } else {
      toast.error(
        'An error occurred. Please try again or contact support if the problem persists.',
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      title: data?.title || '',
      description: data?.description || '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full h-dvh md:h-auto md:max-w-[625px] bg-card overflow-y-auto">
        {!isEditing || isArchived ? (
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>{data?.title || 'Task'}</DialogTitle>
              <DialogDescription>
                {isArchived
                  ? 'View archived task details. This task cannot be edited.'
                  : 'View task details. Click edit to modify.'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              {data?.description && (
                <div className="border rounded-lg p-4 bg-background">
                  <p className="whitespace-pre-wrap text-sm">{data.description}</p>
                </div>
              )}

              {!data?.description && (
                <div className="text-center text-muted-foreground py-8">
                  No description available
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-row justify-end gap-2">
              {data && deleteItem && archiveItem && !isArchived && (
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
                    <Button
                      type="button"
                      className="bg-transparent border-zinc-500/50 border-2 p-2 hover:bg-transparent hover:border-zinc-500"
                    >
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
                    <Button
                      type="button"
                      className="bg-transparent border-red-900/50 border-2 p-2 hover:bg-transparent hover:border-red-900"
                    >
                      <Trash color="#AA0000" size={20} />
                    </Button>
                  </ConfirmDialog>
                </>
              )}

              {!isArchived && (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
              )}
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{data ? 'Edit' : 'Add a new'} task</DialogTitle>
              <DialogDescription>
                {data ? 'Edit' : 'Add a new'} task and its description. Click save when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>

            <TaskForm register={register} errors={errors} />

            <DialogFooter className="flex flex-row justify-end gap-2">
              {data && archiveItem && !isArchived && (
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
                  <Button
                    type="button"
                    className="bg-transparent border-zinc-500/50 border-2 p-2 hover:bg-transparent hover:border-zinc-500"
                  >
                    <Archive color="#737373" size={20} />
                  </Button>
                </ConfirmDialog>
              )}
              {data && deleteItem && (
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
                  <Button
                    type="button"
                    className="bg-transparent border-red-900/50 border-2 p-2 hover:bg-transparent hover:border-red-900"
                  >
                    <Trash color="#AA0000" size={20} />
                  </Button>
                </ConfirmDialog>
              )}

              {data && !isArchived && (
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              )}

              {!isArchived && (
                <Button type="submit" isSubmitting={isSubmitting}>
                  Save{!data && ' task'}
                </Button>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
