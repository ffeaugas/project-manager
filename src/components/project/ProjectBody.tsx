'use client';

import { useProjectDetails } from '@/hooks/use-project-details';
import { useProjectsList } from '@/hooks/use-projects-list';
import ProjectHeader from './ProjectHeader';
import { Spinner } from '../ui/spinner';
import CreateProjectCardDialog from './dialogs/CreateProjectCardDialog';
import ProjectCard from './ProjectCard';
import { ProjectCardType, ProjectWithUrls } from '@/app/api/projects/cards/types';
import { ProjectType } from '@/app/api/projects/types';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';

interface IProjectBodyProps {
  projectId: string;
  referencesSlot?: React.ReactNode;
}

const ProjectBody = ({ projectId, referencesSlot }: IProjectBodyProps) => {
  const {
    project,
    isLoading,
    createProjectCard,
    updateProjectCard,
    deleteProjectCard,
    error,
    fetchProject,
  } = useProjectDetails(projectId);
  const { deleteProject, updateProject: updateProjectInList } = useProjectsList();

  const updateProject = async (bodyData: ProjectType, id: string) => {
    const result = await updateProjectInList(id, bodyData);
    if (result) {
      await fetchProject();
    }
    return result;
  };

  const [isReferencesOpen, setIsReferencesOpen] = useState(false);

  if (error) {
    return (
      <div className="text-red-500 w-full h-dvh flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (isLoading || !project) {
    return <Spinner size="large" />;
  }

  return (
    <div className="flex flex-col h-dvh flex-1">
      <ProjectHeader
        createProjectCard={createProjectCard}
        project={project}
        deleteProject={deleteProject}
        updateProject={updateProject}
        onShowReferences={referencesSlot ? () => setIsReferencesOpen(true) : undefined}
      />
      <CardList
        cards={project.projectCards}
        createProjectCard={createProjectCard}
        updateProjectCard={updateProjectCard}
        deleteProjectCard={deleteProjectCard}
        projectId={projectId}
      />
      {referencesSlot && (
        <Sheet open={isReferencesOpen} onOpenChange={setIsReferencesOpen}>
          <SheetTitle />
          <SheetContent className="bg-card w-full sm:w-[540px] overflow-y-auto p-0">
            <div className="p-6">{referencesSlot}</div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ProjectBody;

interface ICardListProps {
  cards: ProjectWithUrls['projectCards'];
  createProjectCard: (bodyData: ProjectCardType) => Promise<boolean>;
  updateProjectCard: (bodyData: ProjectCardType, id: string) => Promise<boolean>;
  deleteProjectCard: (id: string) => Promise<boolean>;
  projectId: string;
}

const CardList = ({
  cards = [],
  createProjectCard,
  updateProjectCard,
  deleteProjectCard,
  projectId,
}: ICardListProps) => {
  return (
    <div className="w-full overflow-auto flex-1 bg-dotted">
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
                updateProjectCard={updateProjectCard}
                deleteProjectCard={deleteProjectCard}
              />
            ))
        ) : (
          <EmptyCard createProjectCard={createProjectCard} projectId={projectId} />
        )}
      </div>
    </div>
  );
};

interface IEmptyCardProps {
  createProjectCard: (bodyData: ProjectCardType) => Promise<boolean>;
  projectId: string;
}

const EmptyCard = ({ createProjectCard, projectId }: IEmptyCardProps) => {
  return (
    <CreateProjectCardDialog onSubmit={createProjectCard} projectId={projectId}>
      <div className="rounded-lg w-full md:w-[280px] h-[280px] md:h-[320px] flex flex-col justify-center items-center overflow-hidden bg-transparent border-dashed border-2 border-border hover:border-zinc-600 p-4 text-zinc-600 text-sm md:text-lg cursor-pointer transition-colors">
        <p className="text-zinc-400">ajouter une carte</p>
      </div>
    </CreateProjectCardDialog>
  );
};
