'use client';

import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form';
import { NewTaskType } from '@/app/api/columns/tasks/types';

interface TaskFormProps {
  register: UseFormRegister<NewTaskType>;
  errors: FieldErrors<NewTaskType>;
}

const TaskForm = ({
  register,
  errors,
}: TaskFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input {...register('title')} id="title" />
        {errors.title && (
          <span className="text-red-500 text-sm">{errors.title.message}</span>
        )}
      </div>
      <div className="items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          {...register('description')}
          id="description"
          className="resize-none"
          rows={8}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">{errors.description.message}</span>
        )}
      </div>
    </div>
  );
};

export default TaskForm;

