'use client';

import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { ProjectType, ProjectCategory } from '@/app/api/projects/types';
import { PROJECT_CATEGORIES, PROJECT_CATEGORY_KEYS } from '@/const/categories';
import { getProjectCategory } from '@/app/api/projects/utils';
import LucidIcon from '@/components/utils/LucidIcon';

interface ProjectFormProps {
  register: UseFormRegister<ProjectType>;
  watch: UseFormWatch<ProjectType>;
  errors: FieldErrors<ProjectType>;
}

const ProjectForm = ({ register, watch, errors }: ProjectFormProps) => {
  const selectedCategoryKey = watch('category');
  const selectedCategory = getProjectCategory(selectedCategoryKey);

  return (
    <div className="space-y-4 py-4">
      <div className="items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input {...register('name')} id="name" />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>
      <div className="items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Input {...register('description')} id="description" placeholder="" />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </div>
      <CategorySelect selectedCategory={selectedCategory} register={register} />
      {errors.category && (
        <span className="text-red-500">{errors.category.message as string}</span>
      )}
    </div>
  );
};

export default ProjectForm;

interface ICategorySelectProps {
  selectedCategory: ProjectCategory;
  register: UseFormRegister<ProjectType>;
}

const CategorySelect = ({ selectedCategory, register }: ICategorySelectProps) => {
  return (
    <div className="items-center gap-4">
      <Label htmlFor="category" className="text-right">
        Category
      </Label>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-borderColor">
          <LucidIcon
            icon={selectedCategory.icon}
            size={16}
            color={selectedCategory.color}
          />
        </div>
        <select
          id="category"
          className="flex h-9 w-full rounded-md border border-borderColor bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:ring-2 focus:ring-zinc-600"
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
