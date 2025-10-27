'use client';

import { useProjects } from '@/hooks/use-projects';
import ProjectHeader from './ProjectHeader';
import { Spinner } from '../ui/spinner';
import { NewProjectCardType, ProjectWithUrls } from './types';
import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import ProjectCard from './ProjectCard';

interface IProjectBodyProps {
  projectId: string;
}

const ProjectBody = ({ projectId }: IProjectBodyProps) => {
  const {
    project,
    isLoading,
    submitProjectCard,
    deleteProject,
    deleteProjectCard,
    error,
  } = useProjects(projectId);

  if (error) {
    return (
      <div className="text-red-500 w-full h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (isLoading || !project) {
    return <Spinner size="large" />;
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <ProjectHeader
        submitProjectCard={submitProjectCard}
        project={project}
        deleteProject={deleteProject}
      />
      <CardList
        cards={project.projectCards}
        submitProjectCard={submitProjectCard}
        deleteProjectCard={deleteProjectCard}
        projectId={parseInt(projectId)}
      />
    </div>
  );
};

export default ProjectBody;

interface ICardListProps {
  cards: ProjectWithUrls['projectCards'];
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: number; projectId?: number },
  ) => Promise<boolean>;
  deleteProjectCard: (id: number) => Promise<boolean>;
  projectId: number;
}

const CardList = ({
  cards = [],
  submitProjectCard,
  deleteProjectCard,
  projectId,
}: ICardListProps) => {
  return (
    <div className="w-full overflow-auto">
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 p-3 md:p-6 justify-center md:justify-start">
        {cards.length > 0 ? (
          cards
            .sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )
            .map((card) => (
              <ProjectCard
                key={card.id}
                data={card}
                submitProjectCard={submitProjectCard}
                deleteProjectCard={deleteProjectCard}
                projectId={projectId}
              />
            ))
        ) : (
          <EmptyCard submitProjectCard={submitProjectCard} projectId={projectId} />
        )}
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
      <div className="rounded-lg w-full md:w-[280px] h-[280px] md:h-[320px] flex flex-col justify-center items-center overflow-hidden bg-transparent border-dashed border-2 border-zinc-700 hover:border-zinc-600 p-4 text-zinc-600 text-sm md:text-lg cursor-pointer transition-colors">
        <p className="text-zinc-400">ajouter une carte</p>
      </div>
    </NewProjectCardDialog>
  );
};
