import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import { NewProjectCardType } from './types';

interface IProjectHeaderProps {
  submitProjectCard: (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: number; projectId?: number },
  ) => Promise<boolean>;
  projectId: number;
}

const ProjectHeader = ({ submitProjectCard, projectId }: IProjectHeaderProps) => {
  return (
    <div className="flex flex-row p-4 justify-end w-full bg-zinc-900 border-b-[1px] border-zinc-700 flex-shrink-0">
      <NewProjectCardDialog submitProjectCard={submitProjectCard} projectId={projectId}>
        <Button variant="outline" className="bg-zinc-900">
          Add card
        </Button>
      </NewProjectCardDialog>
    </div>
  );
};

export default ProjectHeader;
