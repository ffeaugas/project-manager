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
import { ProjectCardType, CreateProjectCardSchema } from '@/app/api/projects/cards/types';
import ProjectCardForm from './ProjectCardForm';

interface CreateProjectCardDialogProps {
  onSubmit: (data: ProjectCardType, projectId: string) => Promise<boolean>;
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
    getValues,
  } = useForm<ProjectCardType>({
    defaultValues: {
      name: '',
      description: '',
      image: undefined,
    },
    resolver: zodResolver(CreateProjectCardSchema),
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

  const handleFormSubmit: SubmitHandler<ProjectCardType> = async (formData) => {
    console.log(formData);
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
      <DialogContent className="h-dvh md:h-auto w-full md:w-[80%] bg-card overflow-y-auto">
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

          {errors.root && (
            <div className="text-red-500 text-sm mt-2">{errors.root.message}</div>
          )}

          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button
              type="submit"
              isSubmitting={isSubmitting}
              onClick={() => console.log(getValues())}
            >
              Save project card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectCardDialog;
