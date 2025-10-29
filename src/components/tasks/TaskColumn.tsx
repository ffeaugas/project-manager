import { GripVertical, Pencil, Trash } from 'lucide-react';
import TaskCard from './TaskCard';
import {
  TaskColumnWithTasks,
  NewTaskType,
  TaskSelect,
} from '../../app/api/columns/tasks/types';
import { NewColumnType } from '../../app/api/columns/types';
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
import ConfirmDialog from '../utils/ConfirmDialog';
import NewColumnDialog from './dialogs/NewColumnDialog';
import { cn } from '@/lib/utils';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ITaskColumnProps {
  data: TaskColumnWithTasks;
  tasks: TaskSelect[];
  createTask: (bodyData: Omit<NewTaskType, 'id'>, columnId: string) => Promise<boolean>;
  updateTask: (
    taskId: string,
    bodyData: Omit<NewTaskType, 'id'>,
    columnId?: string,
  ) => Promise<boolean>;
  submitColumn: (
    bodyData: NewColumnType,
    options?: {
      columnId?: string;
    },
  ) => Promise<boolean>;
  deleteItem: (id: string, route: string) => Promise<boolean>;
  archiveItem: (id: string) => Promise<boolean>;
}

const TaskColumn = ({
  data,
  tasks,
  createTask,
  updateTask,
  submitColumn,
  deleteItem,
  archiveItem,
}: ITaskColumnProps) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: data.id,
      data: {
        type: 'column',
        column: data,
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col justify-start-start gap-4 w-[250px] md:w-[300px] min-h-[400px] p-2 rounded-md bg-zinc-900 flex-shrink-0',
        isDragging && 'opacity-20',
      )}
      style={style}
    >
      <ColumnHeader
        data={data}
        nbTasks={tasks.length}
        submitColumn={submitColumn}
        deleteItem={deleteItem}
        dragAttributes={attributes}
        dragListeners={listeners}
      />
      <SortableContext items={tasks.map((task) => task.id)}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            data={task}
            createTask={createTask}
            updateTask={updateTask}
            deleteItem={deleteItem}
            archiveItem={archiveItem}
          />
        ))}
      </SortableContext>
      <NewTaskDialog createTask={createTask} updateTask={updateTask} columnId={data.id}>
        <Button
          variant="outline"
          className="flex flex-col justify-center w-full h-[80px] md:h-[100px] bg-transparent border-dashed border-2 border-zinc-700 p-4 text-zinc-500 text-xs md:text-sm"
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
      columnId?: string;
    },
  ) => Promise<boolean>;
  deleteItem: (id: string, route: string) => Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragAttributes?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragListeners?: Record<string, any>;
}

const ColumnHeader = ({
  data,
  nbTasks,
  submitColumn,
  deleteItem,
  dragAttributes,
  dragListeners,
}: IColumnHeaderProps) => {
  return (
    <div
      className="flex flex-row justify-between items-center group h-8"
      {...dragAttributes}
      {...dragListeners}
    >
      <div className="flex flex-row gap-4 items-center">
        <div
          className="size-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: data.color }}
        ></div>
        <p className="text-sm md:text-md font-semibold text-zinc-500 truncate">
          {data.name}{' '}
          <b className="font-normal text-zinc-600 text-xs md:text-sm">({nbTasks})</b>
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
      columnId?: string;
    },
  ) => Promise<boolean>;
  deleteItem: (id: string, route: string) => Promise<boolean>;
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
