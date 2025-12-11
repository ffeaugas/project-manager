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
import { useState, useEffect } from 'react';
import {
  UpdateProjectCardSchema,
  ProjectWithUrls,
  ProjectCardType,
  ProjectWithProjectCards,
} from '@/app/api/projects/cards/types';
import { Trash } from 'lucide-react';
import ConfirmDialog from '../../utils/ConfirmDialog';
import ProjectCardForm from './ProjectCardForm';

interface EditProjectCardDialogProps {
  onSubmit: (bodyData: ProjectCardType, id: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  children: React.ReactNode;
  data: ProjectWithProjectCards['projectCards'][number];
}

const EditProjectCardDialog = ({
  onSubmit,
  onDelete,
  children,
  data,
}: EditProjectCardDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectCardType>({
    defaultValues: {
      name: data.name || '',
      description: data.description || '',
      image: undefined,
    },
    resolver: zodResolver(UpdateProjectCardSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: data.name || '',
        description: data.description || '',
        image: undefined,
      });
      setImageFile(null);
    }
  }, [isOpen, data, reset]);

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    setValue('image', file || undefined);
  };

  const handleFormSubmit: SubmitHandler<ProjectCardType> = async (formData) => {
    const success = await onSubmit(formData, data.id);

    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-dvh md:h-auto w-full md:w-[80%] bg-card overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit project card</DialogTitle>
            <DialogDescription>
              Edit project card details. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <ProjectCardForm
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            imageFile={imageFile}
            onFileSelect={handleFileSelect}
            existingImageUrl={data.images?.[0]?.url}
          />

          <DialogFooter className="flex flex-row justify-end gap-2">
            <ConfirmDialog
              id={data.id}
              route="project-cards"
              title="Delete this project card?"
              message="Are you sure you want to delete this project card? This action cannot be undone."
              confirmLabel="Delete"
              action={onDelete}
              onSuccess={() => {
                setIsOpen(false);
              }}
            >
              <Button className="bg-transparent border-red-900/50 border-2 p-2 hover:bg-transparent hover:border-red-900">
                <Trash color="#AA0000" size={20} />
              </Button>
            </ConfirmDialog>

            <Button type="submit" isSubmitting={isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectCardDialog;
