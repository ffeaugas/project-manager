'use client';

import { useProjects } from '@/hooks/use-projects';
import ProjectHeader from './ProjectHeader';
import { Spinner } from '../ui/spinner';
import { NewProjectCardType, ProjectCardSelect } from './types';
import Image from 'next/image';
import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import { SubmitHandler } from 'react-hook-form';

interface IProjectBodyProps {
  projectId: string;
}

const ProjectBody = ({ projectId }: IProjectBodyProps) => {
  const { project, isLoading, submitProjectCard, deleteProjectCard, error } =
    useProjects(projectId);

  if (error) {
    return (
      <div className="text-red-500 w-full h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <ProjectHeader
        submitProjectCard={submitProjectCard}
        projectId={parseInt(projectId)}
      />
      {isLoading || !project ? (
        <Spinner size="large" />
      ) : (
        <CardList
          cards={project.projectCards}
          submitProjectCard={submitProjectCard}
          projectId={parseInt(projectId)}
        />
      )}
    </div>
  );
};

export default ProjectBody;

interface ICardListProps {
  cards: ProjectCardSelect[];
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: number; projectId?: number },
  ) => Promise<boolean>;
  projectId: number;
}

const CardList = ({ cards = [], submitProjectCard, projectId }: ICardListProps) => {
  return (
    <div className="mx-auto flex content-center justify-center w-full">
      <div className="flex flex-1 overflow-auto gap-4 p-4 flex-wrap">
        {cards.length > 0 ? (
          cards.map((card) => <ProjectCard key={card.id} data={card} />)
        ) : (
          <EmptyCard submitProjectCard={submitProjectCard} projectId={projectId} />
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ data }: { data: any }) => {
  const firstImage = data.images?.[0];

  return (
    <div className="bg-zinc-800 rounded-md w-[300px] h-[300px] flex flex-col overflow-hidden justify-start">
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
  );
};

interface IEmptyCardProps {
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: number; projectId?: number },
  ) => Promise<boolean>;
  projectId: number;
}

const EmptyCard = ({ submitProjectCard, projectId }: IEmptyCardProps) => {
  return (
    <NewProjectCardDialog submitProjectCard={submitProjectCard} projectId={projectId}>
      <div
        className="rounded-md w-[300px] h-[300px] flex flex-col justify-center items-center overflow-hidden
      bg-transparent border-dashed border-2 border-zinc-700 p-4 text-zinc-600 text-lg cursor-pointer"
      >
        <p className="text-zinc-400">ajouter une carte</p>
      </div>
    </NewProjectCardDialog>
  );
};
