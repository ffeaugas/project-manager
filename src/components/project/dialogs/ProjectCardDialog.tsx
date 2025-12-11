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
import {
  ProjectCardType,
  ProjectWithUrls,
  CreateProjectCardSchema,
} from '@/app/api/projects/cards/types';
import { Trash, Edit, X } from 'lucide-react';
import ConfirmDialog from '../../utils/ConfirmDialog';
import ProjectCardForm from './ProjectCardForm';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import Image from 'next/image';

interface ProjectCardDialogProps {
  onSubmit: (bodyData: ProjectCardType, id: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  children: React.ReactNode;
  data: ProjectWithUrls['projectCards'][0];
}

const ProjectCardDialog = ({
  onSubmit,
  onDelete,
  children,
  data,
}: ProjectCardDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const firstImage = data.images?.[0];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectCardType>({
    defaultValues: {
      name: data.name || '',
      description: data.description || '',
      image: undefined,
    },
    resolver: zodResolver(CreateProjectCardSchema),
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: data.description || '',
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'w-full p-4 focus:outline-none overflow-auto min-h-[200px] max-h-[500px]',
      },
    },
  });

  useEffect(() => {
    if (editor && data.description !== undefined) {
      editor.commands.setContent(data.description || '');
    }
  }, [editor, data.description, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
      reset({
        name: data.name || '',
        description: data.description || '',
        image: undefined,
      });
      setImageFile(null);
    }
  }, [isOpen, data, reset]);

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    setValue('image', file || undefined);
  };

  const handleFormSubmit: SubmitHandler<ProjectCardType> = async (formData) => {
    const success = await onSubmit(formData, data.id);

    if (success) {
      setIsEditing(false);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: data.name || '',
      description: data.description || '',
      image: undefined,
    });
    setImageFile(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="h-dvh md:h-auto w-full md:w-[80%] bg-card overflow-y-auto">
          {!isEditing ? (
            <div className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>{data.name || 'Project Card'}</DialogTitle>
                <DialogDescription>
                  View project card details. Click edit to modify.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {firstImage && (
                  <div className="w-full">
                    <div
                      onClick={() => setIsImageDialogOpen(true)}
                      className="cursor-pointer rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors"
                    >
                      <Image
                        src={firstImage.mediumUrl || firstImage.url}
                        alt={data.name || 'Project card image'}
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain max-h-[500px]"
                        unoptimized
                      />
                    </div>
                  </div>
                )}

                {data.description && (
                  <div className="border rounded-lg p-4 bg-background">
                    <EditorContent editor={editor} />
                  </div>
                )}

                {!firstImage && !data.description && (
                  <div className="text-center text-muted-foreground py-8">
                    No content to display
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-row justify-end gap-2">
                <ConfirmDialog
                  id={data.id}
                  route="project-cards"
                  title="Delete this project card?"
                  message="Are you sure you want to delete this project card? This action cannot be undone."
                  confirmLabel="Delete"
                  action={onDelete}
                  onSuccess={() => {
                    setIsOpen(false);
                  }}
                >
                  <Button
                    type="button"
                    variant="destructive"
                    className="bg-transparent border-red-900/50 border-2 p-2 hover:bg-transparent hover:border-red-900"
                  >
                    <Trash color="#AA0000" size={20} />
                  </Button>
                </ConfirmDialog>

                <Button type="button" onClick={() => setIsEditing(true)}>
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <DialogHeader>
                <DialogTitle>Edit project card</DialogTitle>
                <DialogDescription>
                  Edit project card details. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>

              <ProjectCardForm
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
                imageFile={imageFile}
                onFileSelect={handleFileSelect}
                existingImageUrl={data.images?.[0]?.url}
                existingMediumUrl={data.images?.[0]?.mediumUrl}
                existingFullUrl={data.images?.[0]?.url}
              />

              <DialogFooter className="flex flex-row justify-end gap-2">
                <ConfirmDialog
                  id={data.id}
                  route="project-cards"
                  title="Delete this project card?"
                  message="Are you sure you want to delete this project card? This action cannot be undone."
                  confirmLabel="Delete"
                  action={onDelete}
                  onSuccess={() => {
                    setIsOpen(false);
                  }}
                >
                  <Button
                    type="button"
                    className="bg-transparent border-red-900/50 border-2 p-2 hover:bg-transparent hover:border-red-900"
                  >
                    <Trash color="#AA0000" size={20} />
                  </Button>
                </ConfirmDialog>

                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>

                <Button type="submit" isSubmitting={isSubmitting}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {firstImage && (
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] bg-card p-2">
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={firstImage.url}
                alt={data.name || 'Project card image'}
                width={1200}
                height={1200}
                className="max-w-full max-h-[90vh] object-contain"
                unoptimized
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProjectCardDialog;
