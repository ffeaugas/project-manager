import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import { NewProjectCardType, ProjectWithUrls } from '@/app/api/projects/cards/types';
import Image from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface IProjectCardProps {
  data: ProjectWithUrls['projectCards'][0];
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: string; projectId?: string },
  ) => Promise<boolean>;
  deleteProjectCard: (id: string) => Promise<boolean>;
  projectId: string;
}

const ProjectCard = ({
  data,
  submitProjectCard,
  deleteProjectCard,
  projectId,
}: IProjectCardProps) => {
  const firstImage = data.images?.[0];

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
    content: data.description || '<p></p>',
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'text-slate-400 text-xs md:text-sm break-words [&_p]:m-0 [&_p:last-child]:m-0 [&_h1]:text-sm [&_h1]:font-bold [&_h1]:mb-1 [&_h1]:mt-0 [&_h1]:text-slate-300 [&_h2]:text-xs [&_h2]:font-bold [&_h2]:mb-1 [&_h2]:mt-0 [&_h2]:text-slate-300 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-0 [&_h3]:text-slate-300 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-1 [&_li]:my-0 [&_code]:bg-zinc-800 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_strong]:font-bold [&_strong]:text-slate-300 [&_em]:italic [&_s]:line-through',
      },
    },
  });

  useEffect(() => {
    if (editor && data.description !== undefined) {
      editor.commands.setContent(data.description || '<p></p>');
    }
  }, [editor, data.description]);

  return (
    <NewProjectCardDialog
      submitProjectCard={submitProjectCard}
      deleteProjectCard={deleteProjectCard}
      projectId={projectId}
      data={data}
    >
      <div
        className="bg-zinc-900 rounded-lg w-full md:min-w-[280px] h-[280px] md:h-[320px] flex flex-col overflow-hidden flex-1
      justify-start cursor-pointer hover:bg-zinc-750 transition-colors shadow-md hover:shadow-lg border-[1px] border-black relative"
      >
        {firstImage && (
          <div className="w-full h-[70%] overflow-hidden relative">
            <Image
              src={firstImage.url}
              alt={data.name || 'Project card image'}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, 280px"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 flex-1">
          {data.name && (
            <div className="border-b-[1px] border-zinc-700 px-2 py-1">
              <p className="text-white text-sm md:text-base font-bold line-clamp-2 break-words">
                {data.name}
              </p>
            </div>
          )}
          {data.description && (
            <div
              className={cn(
                'p-4 overflow-hidden',
                firstImage ? 'line-clamp-2' : 'line-clamp-[11]',
              )}
            >
              <EditorContent editor={editor} />
            </div>
          )}
          {!firstImage && (
            <span className="bottom-0 right-0 z-10 absolute h-20 w-full bg-gradient-to-t from-zinc-900 via-zinc-900/70 via-50% to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </NewProjectCardDialog>
  );
};

export default ProjectCard;
