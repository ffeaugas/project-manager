import { Button } from '../ui/button';
import { ProjectCardType, ProjectWithUrls } from '@/app/api/projects/cards/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { GripVertical, Trash, NotebookText, Pencil, Plus } from 'lucide-react';
import ConfirmDialog from '../utils/ConfirmDialog';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import LucidIcon from '../utils/LucidIcon';
import { getProjectCategory } from '@/app/api/projects/utils';
import CreateProjectCardDialog from './dialogs/CreateProjectCardDialog';
import EditProjectDialog from './dialogs/EditProjectDialog';
import { ProjectType } from '@/app/api/projects/types';
import Header from '../common/Header';
import { ReactNode } from 'react';

interface IProjectHeaderProps {
  createProjectCard: (bodyData: ProjectCardType) => Promise<boolean>;
  project: ProjectWithUrls;
  deleteProject: (id: string) => Promise<boolean>;
  updateProject: (bodyData: ProjectType, id: string) => Promise<boolean>;
  onShowReferences?: () => void;
  breadcrumbs?: ReactNode;
}

const ProjectHeader = ({
  createProjectCard,
  project,
  deleteProject,
  updateProject,
  onShowReferences,
  breadcrumbs,
}: IProjectHeaderProps) => {
  return (
    <Header className="z-10">
      <div className="flex flex-row gap-4 items-center">
        {breadcrumbs && <div className="mr-4">{breadcrumbs}</div>}
        <LucidIcon
          icon={getProjectCategory(project.category).icon}
          size={40}
          color={getProjectCategory(project.category).color}
          className="border border-border rounded-sm p-2 lg:block hidden"
        />
        <span className="text-xs md:text-lg font-semibold">{project.name}</span>
      </div>
      <div className="flex flex-row gap-2">
        <CreateProjectCardDialog onSubmit={createProjectCard} projectId={project.id}>
          <Button
            variant="dashed"
            className="bg-card text-xs md:text-sm font-semibold flex flex-row items-center justify-center"
          >
            <Plus size={16} className="mr-2" />
            Add card
          </Button>
        </CreateProjectCardDialog>
        <Menu
          project={project}
          deleteProject={deleteProject}
          updateProject={updateProject}
          onShowReferences={onShowReferences}
        />
      </div>
    </Header>
  );
};

export default ProjectHeader;

interface IMenuProps {
  project: ProjectWithUrls;
  deleteProject: (id: string) => Promise<boolean>;
  updateProject: (bodyData: ProjectType, id: string) => Promise<boolean>;
  onShowReferences?: () => void;
}

const Menu = ({
  project,
  deleteProject,
  updateProject,
  onShowReferences,
}: IMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="group p-2 border ">
          <GripVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-background">
        {onShowReferences && (
          <DropdownMenuItem
            className="w-full flex justify-between text-muted-foreground cursor-pointer md:hidden"
            onSelect={onShowReferences}
          >
            References
            <NotebookText size={16} />
          </DropdownMenuItem>
        )}
        <EditProjectDialog onSubmit={updateProject} project={project}>
          <DropdownMenuItem
            className="w-full flex justify-between text-muted-foreground cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Edit project
            <Pencil size={16} />
          </DropdownMenuItem>
        </EditProjectDialog>
        <ConfirmDialog
          id={project.id}
          route="projects"
          title={`Delete project ${project.name} ?`}
          message="Are you sure you want to delete this project? This action cannot be undone."
          action={deleteProject}
          confirmLabel="Delete"
          onSuccess={() => {
            toast.success('Project deleted successfully');
            redirect('/home');
          }}
        >
          <DropdownMenuItem
            className="w-full flex justify-between text-muted-foreground cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Delete project
            <Trash size={16} />
          </DropdownMenuItem>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
