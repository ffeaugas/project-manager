import { TaskColumnWithTasks } from '@/app/api/columns/tasks/types';
import { NewColumnType } from '@/app/api/columns/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewColumnDialog from '../dialogs/NewColumnDialog';
import ConfirmDialog from '@/components/utils/ConfirmDialog';
import { Pencil, Trash } from 'lucide-react';

interface ITaskColumnDropdownMenuProps {
  data: TaskColumnWithTasks;
  submitColumn: (
    bodyData: NewColumnType,
    options?: {
      columnId?: string;
    },
  ) => Promise<boolean>;
  deleteItem: (id: string, route: string) => Promise<boolean>;
}

const TaskColumnDropdownMenu = ({
  data,
  submitColumn,
  deleteItem,
}: ITaskColumnDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-zinc-900 hover:bg-transparent group hover:border-zinc-500 p-2 border ">
          <GripVertical className="text-zinc-700 group-hover:text-zinc-500" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background">
        <DropdownMenuLabel>{data.name}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuGroup>
          <NewColumnDialog submitColumn={submitColumn} data={data}>
            <DropdownMenuItem
              className="flex justify-between text-zinc-300"
              onSelect={(event) => event.preventDefault()}
            >
              Edit
              <Pencil />
            </DropdownMenuItem>
          </NewColumnDialog>
          <ConfirmDialog
            id={data.id}
            route="columns"
            title={`Delete ${data.name} ?`}
            message="Are you sure you want to delete this column? Tasks inside will me removed too. This action cannot be undone."
            action={deleteItem}
            confirmLabel="Delete"
          >
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="flex justify-between text-zinc-300"
            >
              Delete
              <Trash />
            </DropdownMenuItem>
          </ConfirmDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskColumnDropdownMenu;
