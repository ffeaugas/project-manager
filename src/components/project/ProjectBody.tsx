'use client';

import { useProjects } from '@/hooks/use-projects';
import ProjectHeader from './ProjectHeader';

const ProjectBody = ({ projectId }: { projectId: string }) => {
  const { project, submitProjectCard, deleteProjectCard } = useProjects(projectId);

  return (
    <div className="flex flex-col h-full max-h-screen">
      <ProjectHeader submitProjectCard={submitProjectCard} />
      <div className="flex-1 overflow-auto"></div>
    </div>
  );
};

export default ProjectBody;
