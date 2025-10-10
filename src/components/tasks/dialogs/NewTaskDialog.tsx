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
import { newTaskSchema, NewTaskType, TaskSelect } from '../types';
import { useState } from 'react';
import { Trash } from 'lucide-react';
import DeleteDialog from '@/components/utils/DeleteDialog';

interface INewTaskDialogProps {
  submitTask: (
    bodyData: NewTaskType,
    options?: {
      taskId?: number;
      columnId?: number | null;
      pageName?: string | null;
    },
  ) => Promise<boolean>;
  deleteItem?: (id: number, type: 'task-columns' | 'tasks') => Promise<boolean>;
  children: React.ReactNode;
  data?: TaskSelect | null;
  columnId?: number | null;
  pageName?: string | null;
}

const NewTaskDialog = ({
  submitTask,
  deleteItem,
  children,
  data = null,
  columnId = null,
  pageName = null,
}: INewTaskDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<NewTaskType>({
    defaultValues: { title: data?.title || '', description: data?.description || '' },
    resolver: zodResolver(newTaskSchema),
  });

  const onSubmit: SubmitHandler<NewTaskType> = async (bodyData) => {
    const success = await submitTask(bodyData, {
      taskId: data?.id,
      columnId,
      pageName,
    });

    if (success) {
      reset();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{data ? 'Edit' : 'Add a new'} task</DialogTitle>
            <DialogDescription>
              {data ? 'Edit' : 'Add a new'} task and its description. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input {...register('title')} id="title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                {...register('description')}
                id="description"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            {data && deleteItem && (
              <DeleteDialog
                id={data.id}
                type="tasks"
                title="Delete this task ?"
                message="Are you sure you want to delete this task ? This action cannot be undone."
                deleteItem={deleteItem}
                onSuccess={() => {
                  setIsOpen(false);
                }}
              >
                <Button className="bg-transparent border-red-900/50 border-2 p-2 hover:bg-transparent hover:border-red-900">
                  <Trash color="#AA0000" size={20} />
                </Button>
              </DeleteDialog>
            )}
            <Button type="submit">Save{!data && ' task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
