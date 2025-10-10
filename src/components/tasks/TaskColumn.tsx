import { GripVertical, Pencil, Trash } from 'lucide-react';
import TaskCard from './TaskCard';
import { TaskColumnWithTasks } from './types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NewTaskDialog from './dialogs/NewTaskDialog';
import DeleteDialog from '../utils/DeleteDialog';
import NewColumnDialog from './dialogs/NewColumnDialog';

interface ITaskColumnProps {
  data: TaskColumnWithTasks;
  refreshTaskColumns: () => void;
  pageName: string;
}

const TaskColumn = ({ data, refreshTaskColumns, pageName }: ITaskColumnProps) => {
  return (
    <div className="flex flex-col justify-start-start gap-4 w-[300px] min-h-[400px] p-4 rounded-lg">
      <ColumnHeader
        data={data}
        nbTasks={data.tasks.length}
        refreshTaskColumns={refreshTaskColumns}
        pageName={pageName}
      />
      {data.tasks.length > 0 ? (
        <>
          {data.tasks.map((task) => (
            <TaskCard key={task.id} data={task} refreshTaskColumns={refreshTaskColumns} />
          ))}
        </>
      ) : (
        <NewTaskDialog refreshTaskColumns={refreshTaskColumns} columnId={data.id}>
          <Button
            variant="outline"
            className="flex flex-col justify-center w-full h-[150px] bg-transparent border-dashed border-2 border-zinc-700 p-4 text-zinc-500 text-sm"
          >
            Click to add a new task
          </Button>
        </NewTaskDialog>
      )}
    </div>
  );
};

export default TaskColumn;

interface IColumnHeaderProps {
  data: TaskColumnWithTasks;
  nbTasks: number;
  refreshTaskColumns: () => void;
  pageName: string;
}

const ColumnHeader = ({
  data,
  nbTasks,
  refreshTaskColumns,
  pageName,
}: IColumnHeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center group h-8">
      <div className="flex flex-row gap-4 items-center">
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: data.color }}
        ></div>
        <p className="text-md font-semibold text-zinc-500">
          {data.name} <b className="font-normal text-zinc-600 text-sm">({nbTasks})</b>
        </p>
      </div>
      <ColDropdownMenu
        data={data}
        refreshTaskColumns={refreshTaskColumns}
        pageName={pageName}
      />
    </div>
  );
};

interface IColDropdownMenuProps {
  data: TaskColumnWithTasks;
  refreshTaskColumns: () => void;
  pageName: string;
}

const ColDropdownMenu = ({
  data,
  refreshTaskColumns,
  pageName,
}: IColDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-zinc-900 hover:bg-transparent group hover:border-zinc-500 p-2 border-[1px] ">
          <GripVertical className="text-zinc-700 group-hover:text-zinc-500" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-800">
        <DropdownMenuLabel>{data.name}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuGroup>
          <NewColumnDialog
            refreshTaskColumns={refreshTaskColumns}
            data={data}
            pageName={pageName}
          >
            <DropdownMenuItem
              className="flex justify-between text-zinc-300"
              onSelect={(event) => event.preventDefault()}
            >
              Edit
              <Pencil />
            </DropdownMenuItem>
          </NewColumnDialog>
          <DeleteDialog
            id={data.id}
            route="/api/task-columns"
            title={`Delete ${data.name} ?`}
            message="Are you sure you want to delete this column? Tasks inside will me removed too. This action cannot be undone."
            onSuccess={refreshTaskColumns}
          >
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="flex justify-between text-zinc-300"
            >
              Delete
              <Trash />
            </DropdownMenuItem>
          </DeleteDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
