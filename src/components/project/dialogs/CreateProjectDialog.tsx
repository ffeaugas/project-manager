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
import { useRouter } from 'next/navigation';
import { ProjectSchema, ProjectType } from '@/app/api/projects/types';
import ProjectForm from './ProjectForm';

interface CreateProjectDialogProps {
  onSubmit: (data: ProjectType) => Promise<string>;
  children: React.ReactNode;
}

const CreateProjectDialog = ({ onSubmit, children }: CreateProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectType>({
    defaultValues: {
      name: '',
      description: '',
      category: 'other',
    },
    resolver: zodResolver(ProjectSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        description: '',
        category: 'other',
      });
    }
  }, [isOpen, reset]);

  const handleFormSubmit: SubmitHandler<ProjectType> = async (formData) => {
    try {
      const projectId = await onSubmit(formData);
      reset();
      setIsOpen(false);
      router.push(`/project/${projectId}`);
    } catch (e) {
      console.error('Error creating project:', e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background2">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Add a new project</DialogTitle>
            <DialogDescription>
              Add a new project with name and description. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <ProjectForm register={register} watch={watch} errors={errors} />

          <DialogFooter>
            <Button type="submit" isSubmitting={isSubmitting}>
              Save project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
