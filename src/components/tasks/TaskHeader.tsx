import { Button } from '../ui/button';
import NewTaskDialog from './dialogs/NewTaskDialog';
import { NewTaskType } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Archive, GripVertical } from 'lucide-react';
import Link from 'next/link';

interface ITaskHeaderProps {
  submitTask: (
    bodyData: NewTaskType,
    options?: {
      taskId?: number;
      columnId?: number | null;
    },
  ) => Promise<boolean>;
}

const TaskHeader = ({ submitTask }: ITaskHeaderProps) => {
  return (
    <div className="flex flex-row p-4 justify-end w-full bg-zinc-900 border-b-[1px] border-zinc-700 flex-shrink-0 gap-2">
      <NewTaskDialog submitTask={submitTask}>
        <Button variant="outline" className="bg-zinc-900">
          Add task
        </Button>
      </NewTaskDialog>
      <Menu />
    </div>
  );
};

export default TaskHeader;

const Menu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-zinc-900 hover:bg-transparent group hover:border-zinc-500 p-2 border-[1px] ">
          <GripVertical className="text-zinc-700 group-hover:text-zinc-500" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-zinc-800">
        <DropdownMenuItem>
          <Link
            href="/archives"
            className="flex flex-row justify-between w-full items-center"
          >
            <span>See archives</span>
            <Archive size={16} />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
