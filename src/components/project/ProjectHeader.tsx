import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import NewProjectCardDialog from './dialogs/NewProjectCardDialog';
import { NewProjectCardType } from './types';

interface IProjectHeaderProps {
  submitProjectCard: (bodyData: NewProjectCardType) => Promise<boolean>;
}

const ProjectHeader = ({ submitProjectCard }: IProjectHeaderProps) => {
  return (
    <div className="flex flex-row p-6 justify-between w-full bg-zinc-800 border-l-[1px] border-b-[1px] border-zinc-700 flex-shrink-0">
      <SidebarTrigger />
      <NewProjectCardDialog submitProjectCard={submitProjectCard}>
        <Button variant="outline" className="bg-zinc-900">
          Add card
        </Button>
      </NewProjectCardDialog>
    </div>
  );
};

export default ProjectHeader;
