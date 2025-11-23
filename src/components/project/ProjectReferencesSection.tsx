'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, ExternalLink, Edit, Trash2, NotebookText } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NewProjectReferenceSchema,
  ProjectReferenceSelectType,
} from '@/app/api/projects/references/types';
import ConfirmDialog from '@/components/utils/ConfirmDialog';
import { useReferences } from '@/hooks/use-references';
import { Card, CardContent } from '../ui/card';
import { Spinner } from '../ui/spinner';

interface ProjectReferencesSectionProps {
  projectId: string;
}

const ProjectReferencesSection = ({ projectId }: ProjectReferencesSectionProps) => {
  const { references, isLoading, createReference, updateReference, deleteReference } =
    useReferences(projectId);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingReference, setEditingReference] =
    useState<ProjectReferenceSelectType | null>(null);

  const handleCreate = async (data: {
    name: string;
    description?: string;
    url?: string;
  }) => {
    const success = await createReference(data);
    if (success) {
      setIsSheetOpen(false);
    }
  };

  const handleUpdate = async (
    id: string,
    data: { name: string; description?: string; url?: string },
  ) => {
    const success = await updateReference(id, data);
    if (success) {
      setIsSheetOpen(false);
      setEditingReference(null);
    }
  };

  const handleDelete = async (id: string) => {
    return await deleteReference(id);
  };

  return (
    <Card>
      <CardContent className="p-2 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <NotebookText size={16} />
          <h2 className="text-md font-semibold text-foreground">References</h2>
        </div>
        <NewReferenceSheet
          onSave={
            editingReference
              ? (data) => handleUpdate(editingReference.id, data)
              : handleCreate
          }
          editingReference={editingReference}
          onOpenChange={(open) => {
            setIsSheetOpen(open);
            if (!open) setEditingReference(null);
          }}
          isOpen={isSheetOpen}
        />

        <div className="flex-1 overflow-auto space-y-2">
          {isLoading ? (
            <Spinner size="small" className="h-[100px]" />
          ) : references.length === 0 ? (
            <div className="text-foreground3 text-sm">No references yet</div>
          ) : (
            references.map((reference) => (
              <ReferenceCard
                key={reference.id}
                reference={reference}
                onEdit={() => {
                  setEditingReference(reference);
                  setIsSheetOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ReferenceCardProps {
  reference: ProjectReferenceSelectType;
  onEdit: () => void;
  onDelete: (id: string) => Promise<boolean>;
}

const ReferenceCard = ({ reference, onEdit, onDelete }: ReferenceCardProps) => {
  return (
    <div className="bg-background2 rounded-lg p-3 border border-zinc-800 hover:border-borderColor transition-colors group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-foreground truncate flex-1">{reference.name}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-foreground2 hover:text-foreground"
            onClick={onEdit}
          >
            <Edit size={14} />
          </Button>
          <ConfirmDialog
            id={reference.id}
            route=""
            title="Delete this reference?"
            message="Are you sure you want to delete this reference? This action cannot be undone."
            confirmLabel="Delete"
            action={onDelete}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
            >
              <Trash2 size={14} />
            </Button>
          </ConfirmDialog>
        </div>
      </div>
      {reference.description && (
        <p className="text-sm text-foreground2 line-clamp-2 mb-2">
          {reference.description}
        </p>
      )}
      <a
        href={reference.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        <span className="truncate">{reference.url}</span>
        <ExternalLink size={14} className="shrink-0" />
      </a>
    </div>
  );
};

interface NewReferenceSheetProps {
  onSave: (data: { name: string; description?: string; url?: string }) => void;
  editingReference: ProjectReferenceSelectType | null;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

const NewReferenceSheet = ({
  onSave,
  editingReference,
  onOpenChange,
  isOpen,
}: NewReferenceSheetProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NewProjectReferenceSchema),
    defaultValues: {
      name: editingReference?.name || '',
      description: editingReference?.description || '',
      url: editingReference?.url || '',
    },
  });

  useEffect(() => {
    reset({
      name: editingReference?.name || '',
      description: editingReference?.description || '',
      url: editingReference?.url || '',
    });
  }, [editingReference, reset]);

  const onSubmit: SubmitHandler<{ name: string; description?: string; url?: string }> = (
    data,
  ) => {
    onSave(data);
    if (!editingReference) {
      reset();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-[30px] flex flex-row items-center justify-center"
        >
          <Plus size={14} />
          Add Reference
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-background2 border-zinc-800 text-zinc-200 w-[400px] sm:w-[540px]"
      >
        <SheetHeader>
          <SheetTitle>{editingReference ? 'Edit' : 'Add'} Reference</SheetTitle>
          <SheetDescription>
            {editingReference ? 'Edit' : 'Add'} a reference link to your project
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter reference name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              {...register('description')}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-400">
                {errors.description.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              {...register('url')}
            />
            {errors.url && (
              <p className="text-sm text-red-400">{errors.url.message as string}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingReference ? 'Save' : 'Add'} Reference</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectReferencesSection;
