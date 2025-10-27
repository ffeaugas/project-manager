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
import { newProjectCardSchema, ProjectWithUrls, type NewProjectCardType } from '../types';
import { useState } from 'react';
import { Trash } from 'lucide-react';
import ConfirmDialog from '../../utils/ConfirmDialog';

interface INewProjectCardDialogProps {
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: {
      projectCardId?: number;
      projectId?: number;
    },
  ) => Promise<boolean>;
  deleteProjectCard?: (id: number) => Promise<boolean>;
  children: React.ReactNode;
  data?: ProjectWithUrls['projectCards'][0] | null;
  projectId?: number;
}

const NewProjectCardDialog = ({
  submitProjectCard,
  deleteProjectCard,
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
    formState: { errors },
  } = useForm<NewProjectCardType>({
    defaultValues: {
      name: data?.name || '',
      description: data?.description || '',
      image: undefined,
    },
    resolver: zodResolver(newProjectCardSchema),
  });

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    setValue('image', file || undefined);
  };

  const onSubmit: SubmitHandler<NewProjectCardType> = async (formData) => {
    const success = await submitProjectCard(formData, {
      projectCardId: data?.id,
      projectId: projectId,
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
                  value={data?.images?.[0]?.url || imageFile}
                />
              </div>
            </div>
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
            {errors.image && <span className="text-red-500">{errors.image.message}</span>}
          </div>
          <DialogFooter className="flex flex-row justify-end gap-2">
            {data && deleteProjectCard && (
              <ConfirmDialog
                id={data.id}
                type="project-cards"
                title="Delete this project card?"
                message="Are you sure you want to delete this project card? This action cannot be undone."
                confirmLabel="Delete"
                action={deleteProjectCard}
                onSuccess={() => {
                  setIsOpen(false);
                }}
              >
                <Button className="bg-transparent border-red-900/50 border-2 p-2 hover:bg-transparent hover:border-red-900">
                  <Trash color="#AA0000" size={20} />
                </Button>
              </ConfirmDialog>
            )}
            <Button type="submit">Save{!data && ' project card'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectCardDialog;
