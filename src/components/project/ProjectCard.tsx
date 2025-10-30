import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import { NewProjectCardType, ProjectWithUrls } from './types';
import Image from 'next/image';

interface IProjectCardProps {
  data: ProjectWithUrls['projectCards'][0];
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: number; projectId?: number },
  ) => Promise<boolean>;
  deleteProjectCard: (id: string) => Promise<boolean>;
  projectId: number;
}

const ProjectCard = ({
  data,
  submitProjectCard,
  deleteProjectCard,
  projectId,
}: IProjectCardProps) => {
  const firstImage = data.images?.[0];

  return (
    <NewProjectCardDialog
      submitProjectCard={submitProjectCard}
      deleteProjectCard={deleteProjectCard}
      projectId={projectId}
      data={data}
    >
      <div className="bg-zinc-900 rounded-lg w-full md:w-[280px] h-[280px] md:h-[320px] flex flex-col overflow-hidden justify-start cursor-pointer hover:bg-zinc-750 transition-colors shadow-md hover:shadow-lg">
        {firstImage && (
          <div className="w-full h-[70%] overflow-hidden relative">
            <Image
              src={firstImage.url}
              alt={data.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, 280px"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 p-3 flex-1">
          <p className="text-white text-sm md:text-base font-bold line-clamp-2 break-words">
            {data.name}
          </p>
          <p className="text-slate-400 text-xs md:text-sm line-clamp-2 md:line-clamp-3 break-words">
            {data.description}
          </p>
        </div>
      </div>
    </NewProjectCardDialog>
  );
};

export default ProjectCard;
