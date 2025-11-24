'use client';

import { useProjects } from '@/hooks/use-projects';
import ProjectHeader from './ProjectHeader';
import { Spinner } from '../ui/spinner';
import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import ProjectCard from './ProjectCard';
import { NewProjectCardType, ProjectWithUrls } from '@/app/api/projects/cards/types';
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
    submitProjectCard,
    deleteProject,
    deleteProjectCard,
    error,
  } = useProjects(projectId);

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
        submitProjectCard={submitProjectCard}
        project={project}
        deleteProject={deleteProject}
        onShowReferences={referencesSlot ? () => setIsReferencesOpen(true) : undefined}
      />
      <CardList
        cards={project.projectCards}
        submitProjectCard={submitProjectCard}
        deleteProjectCard={deleteProjectCard}
        projectId={projectId}
      />
      {referencesSlot && (
        <Sheet open={isReferencesOpen} onOpenChange={setIsReferencesOpen}>
          <SheetTitle />
          <SheetContent className="bg-background2 w-full sm:w-[540px] overflow-y-auto p-0">
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
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: string; projectId?: string },
  ) => Promise<boolean>;
  deleteProjectCard: (id: string) => Promise<boolean>;
  projectId: string;
}

const CardList = ({
  cards = [],
  submitProjectCard,
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
    options?: { projectCardId?: string; projectId?: string },
  ) => Promise<boolean>;
  projectId: string;
}

const EmptyCard = ({ submitProjectCard, projectId }: IEmptyCardProps) => {
  return (
    <NewProjectCardDialog submitProjectCard={submitProjectCard} projectId={projectId}>
      <div className="rounded-lg w-full md:w-[280px] h-[280px] md:h-[320px] flex flex-col justify-center items-center overflow-hidden bg-transparent border-dashed border-2 border-borderColor hover:border-zinc-600 p-4 text-zinc-600 text-sm md:text-lg cursor-pointer transition-colors">
        <p className="text-zinc-400">ajouter une carte</p>
      </div>
    </NewProjectCardDialog>
  );
};
