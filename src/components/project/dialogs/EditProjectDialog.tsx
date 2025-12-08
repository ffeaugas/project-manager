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
import { ProjectSchema, ProjectType } from '@/app/api/projects/types';
import { ProjectWithUrls } from '@/app/api/projects/cards/types';
import ProjectForm from './ProjectForm';
import { ProjectCategoryKey } from '@prisma/client';

interface EditProjectDialogProps {
  onSubmit: (bodyData: ProjectType, id: string) => Promise<boolean>;
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
  } = useForm<ProjectType>({
    defaultValues: {
      name: project.name || '',
      description: project.description || '',
      category: project.category || 'other',
    },
    resolver: zodResolver(ProjectSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: project.name || '',
        description: project.description || '',
        category: project.category || ('other' as ProjectCategoryKey),
      });
    }
  }, [isOpen, project, reset]);

  const handleFormSubmit: SubmitHandler<ProjectType> = async (formData) => {
    const success = await onSubmit(
      {
        ...formData,
      },
      project.id,
    );

    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card">
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
