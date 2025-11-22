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
import { TaskColumnWithTasks } from '@/app/api/columns/tasks/types';
import { newColumnSchema, NewColumnType } from '@/app/api/columns/types';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface INewColumnDialogProps {
  submitColumn: (
    bodyData: NewColumnType,
    options?: {
      columnId?: string;
    },
  ) => Promise<boolean>;
  data?: TaskColumnWithTasks | null;
  children: React.ReactNode;
}

const NewColumnDialog = ({
  submitColumn,
  data = null,
  children,
}: INewColumnDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewColumnType>({
    defaultValues: {
      name: data?.name || '',
      color: data?.color || '#3B82F6',
    },
    resolver: zodResolver(newColumnSchema),
  });
  const [isOpen, setIsOpen] = useState(false);

  const selectedColor = watch('color');

  const onSubmit: SubmitHandler<NewColumnType> = async (bodyData) => {
    const success = await submitColumn(bodyData, {
      columnId: data?.id,
    });

    if (success) {
      reset();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{data ? 'Edit' : 'Add a new'} column</DialogTitle>
            <DialogDescription>
              Add a new column and its color. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input {...register('name')} id="name" />
            </div>
            <div className="items-center gap-4">
              <Label htmlFor="color">Color</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <Input
                    {...register('color')}
                    id="color"
                    className="flex-1"
                    placeholder="#3B82F6"
                  />
                </div>
                <div className="flex justify-center">
                  <HexColorPicker
                    color={selectedColor}
                    onChange={(color) => setValue('color', color)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            {errors.color && <span className="text-red-500">{errors.color.message}</span>}
          </div>
          <DialogFooter>
            <Button type="submit">Save {!data && 'column'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewColumnDialog;
