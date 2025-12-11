'use client';

import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Dropzone } from '../../ui/dropzone';
import TextEditor from '@/components/utils/TextEditor';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from 'react-hook-form';
import { ProjectCardType } from '@/app/api/projects/cards/types';

interface ProjectCardFormProps {
  register: UseFormRegister<ProjectCardType>;
  setValue: UseFormSetValue<ProjectCardType>;
  watch: UseFormWatch<ProjectCardType>;
  errors: FieldErrors<ProjectCardType>;
  imageFile: File | null;
  onFileSelect: (file: File | null) => void;
  existingImageUrl?: string;
  existingMediumUrl?: string;
  existingFullUrl?: string;
}

const ProjectCardForm = ({
  register,
  setValue,
  watch,
  errors,
  imageFile,
  onFileSelect,
  existingImageUrl,
  existingMediumUrl,
  existingFullUrl,
}: ProjectCardFormProps) => {
  const descriptionValue = watch('description');

  return (
    <div className="py-4 grid grid-cols-5 gap-4">
      <div className="items-center gap-4 col-span-5">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input {...register('name')} id="name" />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="items-center gap-4 col-span-5 lg:col-span-4 row-span-3">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <TextEditor
          value={descriptionValue}
          onChange={(value) => setValue('description', value)}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">{errors.description.message}</span>
        )}
      </div>

      <div className="items-start gap-4 col-span-5 lg:col-span-1">
        <Label className="text-right pt-2">Image</Label>
        <Dropzone
          onFileSelect={onFileSelect}
          accept="image/*"
          maxSize={5}
          value={existingImageUrl || imageFile}
          mediumUrl={existingMediumUrl}
          fullUrl={existingFullUrl}
        />
        {errors.image && (
          <span className="text-red-500 text-sm">{errors.image.message}</span>
        )}
      </div>
    </div>
  );
};

export default ProjectCardForm;
