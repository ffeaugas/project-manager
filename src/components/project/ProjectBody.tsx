'use client';

import { useProjects } from '@/hooks/use-projects';
import ProjectHeader from './ProjectHeader';
import { Spinner } from '../ui/spinner';
import { ProjectCardSelect } from './types';
import Image from 'next/image';

interface IProjectBodyProps {
  projectId: string;
}

const ProjectBody = ({ projectId }: IProjectBodyProps) => {
  const { project, isLoading, submitProjectCard, deleteProjectCard } =
    useProjects(projectId);

  return (
    <div className="flex flex-col h-full max-h-screen">
      <ProjectHeader
        submitProjectCard={submitProjectCard}
        projectId={parseInt(projectId)}
      />
      {isLoading || !project ? (
        <Spinner size="large" />
      ) : (
        <CardList cards={project.projectCards} />
      )}
    </div>
  );
};

export default ProjectBody;

interface ICardListProps {
  cards: ProjectCardSelect[];
}

const CardList = ({ cards = [] }: ICardListProps) => {
  return (
    <div className="flex flex-1 overflow-auto gap-4 p-4 flex-wrap">
      {cards.map((card) => (
        <ProjectCard key={card.id} data={card} />
      ))}
    </div>
  );
};

const ProjectCard = ({ data }: { data: ProjectCardSelect }) => {
  return (
    <div className="bg-zinc-800 rounded-md w-[300px] h-[300px] flex flex-col overflow-hidden justify-start">
      {data.imageUrl && (
        <div className="w-full h-[70%] overflow-hidden relative">
          <Image
            src={data.imageUrl}
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
