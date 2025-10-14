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
import { Dropzone } from '../../ui/dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  newProjectCardSchema,
  type NewProjectCardType,
  type ProjectCardSelect,
} from '../types';
import { useState } from 'react';
import { Trash } from 'lucide-react';
import DeleteDialog from '@/components/utils/DeleteDialog';
import type { EntityType } from '@/components/tasks/types';

interface INewProjectCardDialogProps {
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: {
      projectCardId?: number;
      projectId?: number;
    },
  ) => Promise<boolean>;
  deleteItem?: (id: number, type: EntityType) => Promise<boolean>;
  children: React.ReactNode;
  data?: ProjectCardSelect | null;
  projectId?: number;
}

const NewProjectCardDialog = ({
  submitProjectCard,
  deleteItem,
  children,
  data = null,
  projectId,
}: INewProjectCardDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewProjectCardType>({
    defaultValues: {
      name: data?.name || '',
      description: data?.description || '',
      imageUrl: data?.imageUrl || '',
    },
    resolver: zodResolver(newProjectCardSchema),
  });
  const imageUrl = watch('imageUrl');

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setValue('imageUrl', '');
    }
  };

  const onSubmit: SubmitHandler<NewProjectCardType> = async (bodyData) => {
    const success = await submitProjectCard(bodyData, {
      projectCardId: data?.id,
      projectId,
    });

    if (success) {
      reset();
      setImageFile(null);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{data ? 'Edit' : 'Add a new'} project card</DialogTitle>
            <DialogDescription>
              {data ? 'Edit' : 'Add a new'} project card with its details. Click save when
              you&apos;re done.
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
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Image</Label>
              <div className="col-span-3">
                <Dropzone
                  onFileSelect={handleFileSelect}
                  accept="image/*"
                  maxSize={5}
                  value={imageUrl || imageFile}
                />
              </div>
            </div>
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
            {errors.imageUrl && (
              <span className="text-red-500">{errors.imageUrl.message}</span>
            )}
          </div>
          <DialogFooter>
            {data && deleteItem && (
              <DeleteDialog
                id={data.id}
                type="project-cards"
                title="Delete this project card?"
                message="Are you sure you want to delete this project card? This action cannot be undone."
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
            <Button type="submit">Save{!data && ' project card'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectCardDialog;
