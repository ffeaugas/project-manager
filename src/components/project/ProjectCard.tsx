import { ProjectCardType, ProjectWithUrls } from '@/app/api/projects/cards/types';
import Image from 'next/image';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { useEffect, useState } from 'react';
import { NotebookText } from 'lucide-react';
import ProjectCardDialog from './dialogs/ProjectCardDialog';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface IProjectCardProps {
  data: ProjectWithUrls['projectCards'][0];
  updateProjectCard: (bodyData: ProjectCardType, id: string) => Promise<boolean>;
  deleteProjectCard: (id: string) => Promise<boolean>;
}

const ProjectCard = ({
  data,
  updateProjectCard,
  deleteProjectCard,
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
          'h-[300px] w-full p-2 focus:outline-none overflow-auto text-xs [&_h1]:text-xs',
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
    <ProjectCardDialog
      onSubmit={updateProjectCard}
      onDelete={deleteProjectCard}
      data={data}
    >
      <div
        className="bg-card rounded-lg w-full md:min-w-[280px] h-[280px] md:max-w-[400px] md:h-[320px] flex flex-col overflow-hidden flex-1
      justify-start cursor-pointer hover:bg-zinc-750 transition-colors shadow-md hover:shadow-lg border relative"
      >
        {displayAlternative}
      </div>
    </ProjectCardDialog>
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
  const [mediumImageLoaded, setMediumImageLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setMediumImageLoaded(true);
    };
    img.src = firstImage.mediumUrl;
  }, [firstImage.mediumUrl]);

  return (
    <Card className="w-full h-full relative border-0 shadow-none rounded-none group">
      {!mediumImageLoaded && (
        <Image
          src={firstImage.lightUrl}
          alt={data.name || 'Project card image'}
          width={400}
          height={400}
          className={`object-cover w-full h-full object-center transition-opacity duration-300 ${
            mediumImageLoaded ? 'opacity-0' : 'opacity-100 blur-sm'
          }`}
          unoptimized
          priority={true}
        />
      )}
      {mediumImageLoaded && (
        <Image
          src={firstImage.mediumUrl}
          alt={data.name || 'Project card image'}
          width={400}
          height={400}
          className="object-cover w-full h-full object-center absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
          unoptimized
          loading="eager"
        />
      )}
    </Card>
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
    <Card className="flex flex-col h-full border-0 shadow-none rounded-none">
      {data.name && (
        <CardHeader className="border-b border-border px-2 py-1">
          <p className="text-foreground text-sm md:text-base font-bold line-clamp-2 wrap-wrap-break-words">
            {data.name}
          </p>
        </CardHeader>
      )}
      {data.description && (
        <CardContent className="overflow-hidden line-clamp-11 p-0">
          <EditorContent editor={editor} />
        </CardContent>
      )}
    </Card>
  );
};
