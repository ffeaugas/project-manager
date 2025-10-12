import { GripVertical, Pencil, Trash } from 'lucide-react';
import TaskCard from './TaskCard';
import { TaskColumnWithTasks, NewTaskType, NewColumnType, TaskSelect } from './types';
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
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface ITaskColumnProps {
  data: TaskColumnWithTasks;
  submitTask: (
    bodyData: NewTaskType,
    options?: {
      taskId?: number;
      columnId?: number | null;
      pageName?: string | null;
    },
  ) => Promise<boolean>;
  submitColumn: (
    bodyData: NewColumnType,
    options?: {
      columnId?: number;
    },
  ) => Promise<boolean>;
  deleteItem: (id: number, type: 'task-columns' | 'tasks') => Promise<boolean>;
}

const TaskColumn = ({ data, submitTask, submitColumn, deleteItem }: ITaskColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: data.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col justify-start-start gap-4 w-[300px] min-h-[400px] p-2 rounded-md bg-black/10',
        isOver && 'bg/black/50',
      )}
    >
      <ColumnHeader
        data={data}
        nbTasks={data.tasks.length}
        submitColumn={submitColumn}
        deleteItem={deleteItem}
      />
      {data.tasks.map((task) => (
        <TaskCard
          key={task.id}
          data={task}
          submitTask={submitTask}
          deleteItem={deleteItem}
        />
      ))}
      <NewTaskDialog submitTask={submitTask} columnId={data.id}>
        <Button
          variant="outline"
          className="flex flex-col justify-center w-full h-[100px] bg-transparent border-dashed border-2 border-zinc-700 p-4 text-zinc-500 text-sm"
        >
          Click to add a new task
        </Button>
      </NewTaskDialog>
    </div>
  );
};

export default TaskColumn;

interface IColumnHeaderProps {
  data: TaskColumnWithTasks;
  nbTasks: number;
  submitColumn: (
    bodyData: NewColumnType,
    options?: {
      columnId?: number;
    },
  ) => Promise<boolean>;
  deleteItem: (id: number, type: 'task-columns' | 'tasks') => Promise<boolean>;
}

const ColumnHeader = ({
  data,
  nbTasks,
  submitColumn,
  deleteItem,
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
      <ColDropdownMenu data={data} submitColumn={submitColumn} deleteItem={deleteItem} />
    </div>
  );
};

interface IColDropdownMenuProps {
  data: TaskColumnWithTasks;
  submitColumn: (
    bodyData: NewColumnType,
    options?: {
      columnId?: number;
    },
  ) => Promise<boolean>;
  deleteItem: (id: number, type: 'task-columns' | 'tasks') => Promise<boolean>;
}

const ColDropdownMenu = ({ data, submitColumn, deleteItem }: IColDropdownMenuProps) => {
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
          <NewColumnDialog submitColumn={submitColumn} data={data}>
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
            type="task-columns"
            title={`Delete ${data.name} ?`}
            message="Are you sure you want to delete this column? Tasks inside will me removed too. This action cannot be undone."
            deleteItem={deleteItem}
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
