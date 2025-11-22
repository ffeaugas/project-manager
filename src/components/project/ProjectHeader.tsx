import { Button } from '../ui/button';
import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import { NewProjectCardType, ProjectWithUrls } from '@/app/api/projects/cards/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { GripVertical, Trash } from 'lucide-react';
import ConfirmDialog from '../utils/ConfirmDialog';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import LucidIcon from '../utils/LucidIcon';
import { getProjectCategory } from '@/app/api/projects/utils';

interface IProjectHeaderProps {
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: string; projectId?: string },
  ) => Promise<boolean>;
  project: ProjectWithUrls;
  deleteProject: (id: string) => Promise<boolean>;
}

const ProjectHeader = ({
  submitProjectCard,
  project,
  deleteProject,
}: IProjectHeaderProps) => {
  return (
    <div className="flex flex-row h-14 px-2 mx:p-4 justify-between w-full bg-background2 border-b border-borderColor shrink-0 gap-2 items-center">
      <div className="flex flex-row gap-4 items-center">
        <LucidIcon
          icon={getProjectCategory(project.category).icon}
          size={40}
          color={getProjectCategory(project.category).color}
          className="border border-borderColor rounded-sm p-2"
        />
        <span className="text-md md:text-lg font-semibold">{project.name}</span>
      </div>
      <div className="flex flex-row gap-2">
        <NewProjectCardDialog
          submitProjectCard={submitProjectCard}
          projectId={project.id}
        >
          <Button variant="outline" className="bg-background2 text-xs md:text-sm">
            Add card
          </Button>
        </NewProjectCardDialog>
        <Menu project={project} deleteProject={deleteProject} />
      </div>
    </div>
  );
};

export default ProjectHeader;

interface IMenuProps {
  project: ProjectWithUrls;
  deleteProject: (id: string) => Promise<boolean>;
}

const Menu = ({ project, deleteProject }: IMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-zinc-900 hover:bg-transparent group hover:border-zinc-500 p-2 border ">
          <GripVertical className="text-zinc-700 group-hover:text-zinc-500" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-background">
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
            className="w-full flex justify-between text-zinc-300 cursor-pointer"
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
