import { Button } from '../ui/button';
import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import { NewProjectCardType, ProjectWithUrls } from './types';
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

interface IProjectHeaderProps {
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: number; projectId?: number },
  ) => Promise<boolean>;
  project: ProjectWithUrls;
  deleteProject: (id: number) => Promise<boolean>;
}

const ProjectHeader = ({
  submitProjectCard,
  project,
  deleteProject,
}: IProjectHeaderProps) => {
  return (
    <div className="flex flex-row p-4 justify-end w-full bg-zinc-900 border-b-[1px] border-zinc-700 flex-shrink-0 gap-2">
      <NewProjectCardDialog submitProjectCard={submitProjectCard} projectId={project.id}>
        <Button variant="outline" className="bg-zinc-900">
          Add card
        </Button>
      </NewProjectCardDialog>
      <Menu project={project} deleteProject={deleteProject} />
    </div>
  );
};

export default ProjectHeader;

interface IMenuProps {
  project: ProjectWithUrls;
  deleteProject: (id: number) => Promise<boolean>;
}

const Menu = ({ project, deleteProject }: IMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-zinc-900 hover:bg-transparent group hover:border-zinc-500 p-2 border-[1px] ">
          <GripVertical className="text-zinc-700 group-hover:text-zinc-500" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-zinc-800">
        <ConfirmDialog
          id={project.id}
          type="projects"
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
