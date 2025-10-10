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
import { newPageSchema, NewPageType } from '../types';
import { useState } from 'react';

interface INewPageDialogProps {
  data?: { id: number; name: string; icon: string } | null;
  children: React.ReactNode;
  onSuccess: (name: string, icon: string) => void;
}

const NewPageDialog = ({ data = null, children, onSuccess }: INewPageDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewPageType>({
    defaultValues: {
      name: data?.name || '',
      icon: data?.icon || '',
    },
    resolver: zodResolver(newPageSchema),
  });
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit: SubmitHandler<NewPageType> = async (bodyData) => {
    try {
      const requestBody = data ? { ...bodyData, id: data.id } : bodyData;
      const response = await fetch('/api/pages', {
        method: data ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error('Failed to create page');

      reset();
      onSuccess(bodyData.name, bodyData.icon);
      setIsOpen(false);
    } catch (e) {
      console.error('Error creating page:', e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{data ? 'Edit' : 'Add a new'} page</DialogTitle>
            <DialogDescription>
              Add a new page with name and icon. Click save when you&apos;re done.
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
              <Label htmlFor="icon" className="text-right">
                Icon
              </Label>
              <Input
                {...register('icon')}
                id="icon"
                className="col-span-3"
                placeholder="e.g., Home, Brush, Box"
              />
            </div>
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            {errors.icon && <span className="text-red-500">{errors.icon.message}</span>}
          </div>
          <DialogFooter>
            <Button type="submit">Save {!data && 'page'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPageDialog;
