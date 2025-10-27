import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import { NewProjectCardType, ProjectWithUrls } from './types';
import Image from 'next/image';

interface IProjectCardProps {
  data: ProjectWithUrls['projectCards'][0];
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: number; projectId?: number },
  ) => Promise<boolean>;
  deleteProjectCard: (id: number) => Promise<boolean>;
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
      <div className="bg-zinc-800 rounded-md w-[300px] h-[300px] flex flex-col overflow-hidden justify-start cursor-pointer">
        {firstImage && (
          <div className="w-full h-[70%] overflow-hidden relative">
            <Image
              src={firstImage.url}
              alt={data.name}
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
        )}
        <div className="flex flex-col gap-1 p-2">
          <p className="text-white text-md font-bold line-clamp-2 break-words">
            {data.name}
          </p>
          <p className="text-slate-400 text-sm line-clamp-3 break-words">
            {data.description}
          </p>
        </div>
      </div>
    </NewProjectCardDialog>
  );
};

export default ProjectCard;
