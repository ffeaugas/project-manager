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
import { SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { newProjectSchema, NewProjectType } from '@/app/api/projects/types';
import { PROJECT_CATEGORIES, PROJECT_CATEGORY_KEYS } from '@/const/categories';
import { getProjectCategory } from '@/app/api/projects/utils';
import { ProjectCategory } from '@/app/api/projects/types';
import LucidIcon from '@/components/utils/LucidIcon';

interface INewProjectDialogProps {
  data?: { id: string; name: string; description: string } | null;
  submitProject: (bodyData: NewProjectType, projectId?: string) => Promise<boolean>;
  children: React.ReactNode;
}

const NewProjectDialog = ({
  data = null,
  submitProject,
  children,
}: INewProjectDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewProjectType>({
    defaultValues: {
      name: data?.name || '',
      description: data?.description || '',
      category: 'other',
    },
    resolver: zodResolver(newProjectSchema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const selectedCategoryKey = watch('category');
  const selectedCategory = getProjectCategory(selectedCategoryKey);

  const onSubmit: SubmitHandler<NewProjectType> = async (bodyData) => {
    try {
      const projectId = await submitProject(bodyData, data?.id);
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
      <DialogContent className="sm:max-w-[425px] bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{data ? 'Edit' : 'Add a new'} project</DialogTitle>
            <DialogDescription>
              Add a new project with name and description. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input {...register('name')} id="name" />
            </div>
            <div className="items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input {...register('description')} id="description" placeholder="" />
            </div>
            <CategorySelect selectedCategory={selectedCategory} register={register} />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
            {errors.category && (
              <span className="text-red-500">{errors.category.message as string}</span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save {!data && 'project'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;

interface ICategorySelectProps {
  selectedCategory: ProjectCategory;
  register: UseFormRegister<NewProjectType>;
}

const CategorySelect = ({ selectedCategory, register }: ICategorySelectProps) => {
  return (
    <div className="items-center gap-4">
      <Label htmlFor="category" className="text-right">
        Category
      </Label>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700">
          <LucidIcon
            icon={selectedCategory.icon}
            size={16}
            color={selectedCategory.color}
          />
        </div>
        <select
          id="category"
          className="flex h-9 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:ring-2 focus:ring-zinc-600"
          {...register('category')}
          defaultValue="other"
        >
          {PROJECT_CATEGORY_KEYS.map((key) => {
            const cat = PROJECT_CATEGORIES[key];
            return (
              <option key={key} value={key}>
                {cat.name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
