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
import { UpdateProjectSchema, UpdateProjectType } from '@/app/api/projects/types';
import { ProjectWithUrls } from '@/app/api/projects/cards/types';
import ProjectForm from './ProjectForm';
import { ProjectCategoryKey } from '@prisma/client';

interface EditProjectDialogProps {
  onSubmit: (data: UpdateProjectType) => Promise<boolean>;
  children: React.ReactNode;
  project: ProjectWithUrls;
}

const EditProjectDialog = ({ onSubmit, children, project }: EditProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectType>({
    defaultValues: {
      id: project.id,
      name: project.name || '',
      description: project.description || '',
      category: project.category || 'other',
    },
    resolver: zodResolver(UpdateProjectSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        id: project.id,
        name: project.name || '',
        description: project.description || '',
        category: project.category || ('other' as ProjectCategoryKey),
      });
    }
  }, [isOpen, project, reset]);

  const handleFormSubmit: SubmitHandler<UpdateProjectType> = async (formData) => {
    const success = await onSubmit({
      ...formData,
      id: project.id,
    });

    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background2">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>
              Edit project details. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <ProjectForm register={register} watch={watch} errors={errors} />

          <DialogFooter>
            <Button type="submit" isSubmitting={isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
