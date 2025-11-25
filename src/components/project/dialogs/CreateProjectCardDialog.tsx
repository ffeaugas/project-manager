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
import { NewProjectCardType, NewProjectCardSchema } from '@/app/api/projects/cards/types';
import ProjectCardForm from './ProjectCardForm';

interface CreateProjectCardDialogProps {
  onSubmit: (data: NewProjectCardType, projectId: string) => Promise<boolean>;
  children: React.ReactNode;
  projectId: string;
}

const CreateProjectCardDialog = ({
  onSubmit,
  children,
  projectId,
}: CreateProjectCardDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewProjectCardType>({
    defaultValues: {
      name: '',
      description: '',
      image: undefined,
    },
    resolver: zodResolver(NewProjectCardSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        description: '',
        image: undefined,
      });
      setImageFile(null);
    }
  }, [isOpen, reset]);

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    setValue('image', file || undefined);
  };

  const handleFormSubmit: SubmitHandler<NewProjectCardType> = async (formData) => {
    const success = await onSubmit(formData, projectId);

    if (success) {
      reset();
      setImageFile(null);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-dvh md:h-auto w-full md:w-[80%] bg-background2 overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Add a new project card</DialogTitle>
            <DialogDescription>
              Add a new project card with its details. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <ProjectCardForm
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            imageFile={imageFile}
            onFileSelect={handleFileSelect}
          />

          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button type="submit" isSubmitting={isSubmitting}>
              Save project card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectCardDialog;
