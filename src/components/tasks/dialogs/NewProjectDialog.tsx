'use client';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newProjectSchema, NewProjectType } from '../types';
import { useState } from 'react';

interface INewProjectDialogProps {
  data?: { id: number; name: string; description: string } | null;
  children: React.ReactNode;
  onSuccess: (name: string, description: string) => void;
}

const NewProjectDialog = ({
  data = null,
  children,
  onSuccess,
}: INewProjectDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewProjectType>({
    defaultValues: {
      name: data?.name || '',
      description: data?.description || '',
    },
    resolver: zodResolver(newProjectSchema),
  });
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit: SubmitHandler<NewProjectType> = async (bodyData) => {
    try {
      const requestBody = data ? { ...bodyData, id: data.id } : bodyData;
      const response = await fetch('/api/projects', {
        method: data ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error('Failed to create project');

      reset();
      onSuccess(bodyData.name, bodyData.description);
      setIsOpen(false);
    } catch (e) {
      console.error('Error creating project:', e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{data ? 'Edit' : 'Add a new'} project</DialogTitle>
            <DialogDescription>
              Add a new project with name and description. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input {...register('name')} id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                {...register('description')}
                id="description"
                className="col-span-3"
                placeholder="e.g., Q4 Marketing Campaign"
              />
            </div>
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save {!data && 'project'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
