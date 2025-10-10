import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import NewTaskDialog from './dialogs/NewTaskDialog';
import { NewTaskType } from './types';

interface ITaskHeaderProps {
  submitTask: (
    bodyData: NewTaskType,
    options?: {
      taskId?: number;
      columnId?: number | null;
      pageName?: string | null;
    },
  ) => Promise<boolean>;
  pageName: string;
}

const TaskHeader = ({ submitTask, pageName }: ITaskHeaderProps) => {
  return (
    <div className="flex flex-row p-6 justify-between w-full bg-zinc-800 border-l-[1px] border-b-[1px] border-zinc-700 flex-shrink-0">
      <div className="flex flex-row gap-4 items-center">
        <SidebarTrigger />
      </div>
      <NewTaskDialog submitTask={submitTask} pageName={pageName}>
        <Button variant="outline" className="bg-zinc-900">
          Add task
        </Button>
      </NewTaskDialog>
    </div>
  );
};

export default TaskHeader;
