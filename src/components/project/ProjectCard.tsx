import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import { NewProjectCardType, ProjectWithUrls } from '@/app/api/projects/cards/types';
import Image from 'next/image';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { useEffect } from 'react';
import { NotebookText } from 'lucide-react';

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
          'h-[300px] w-full p-2 bg-zinc-800 focus:outline-none overflow-auto text-xs [&_h1]:text-xs',
      },
    },
  });

  useEffect(() => {
    if (editor && data.description !== undefined) {
      editor.commands.setContent(data.description || '<p></p>');
    }
  }, [editor, data.description]);

  const displayAlternative = firstImage ? (
    <ImageDisplay data={data} firstImage={firstImage} />
  ) : (
    <NoteDisplay data={data} editor={editor} />
  );

  return (
    <NewProjectCardDialog
      submitProjectCard={submitProjectCard}
      deleteProjectCard={deleteProjectCard}
      projectId={projectId}
      data={data}
    >
      <div
        className="bg-background rounded-lg w-full md:min-w-[280px] h-[280px] max-w-[400px] md:h-[320px] flex flex-col overflow-hidden flex-1
      justify-start cursor-pointer hover:bg-zinc-750 transition-colors shadow-md hover:shadow-lg border relative"
      >
        {displayAlternative}
      </div>
    </NewProjectCardDialog>
  );
};

export default ProjectCard;

const ImageDisplay = ({
  data,
  firstImage,
}: {
  data: ProjectWithUrls['projectCards'][0];
  firstImage: ProjectWithUrls['projectCards'][0]['images'][0];
}) => {
  return (
    <div className="w-full h-full relative">
      <Image
        src={firstImage.url}
        alt={data.name || 'Project card image'}
        width={500}
        height={500}
        className="object-cover w-full h-full object-center"
      />
      {data.name && (
        <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-background3/50 to-transparent backdrop-blur-xs p-2">
          <p className="text-foreground text-sm md:text-base font-bold line-clamp-2 wrap-wrap-break-words">
            {data.name}
          </p>
        </div>
      )}
      {data.description && (
        <span className="absolute bottom-0 right-0 p-2">
          <NotebookText className="size-10 bg-background3 p-3 rounded-md" />
        </span>
      )}
    </div>
  );
};

const NoteDisplay = ({
  data,
  editor,
}: {
  data: ProjectWithUrls['projectCards'][0];
  editor: Editor | null;
}) => {
  return (
    <div className="flex flex-col">
      {data.name && (
        <div className="border-b border-borderColor px-2 py-1">
          <p className="text-foreground text-sm md:text-base font-bold line-clamp-2 wrap-wrap-break-words">
            {data.name}
          </p>
        </div>
      )}
      {data.description && (
        <div className="overflow-hidden line-clamp-11">
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
};
