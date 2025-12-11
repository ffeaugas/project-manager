import TaskCard from './TaskCard';
import { ColumnWithTasks, NewTaskType, Task } from '../../app/api/columns/tasks/types';
import { NewColumnType } from '../../app/api/columns/types';
import { Button } from '@/components/ui/button';
import NewTaskDialog from './dialogs/NewTaskDialog';
import { cn } from '@/lib/utils';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskColumnDropdownMenu from './menus/TaskColumnDropdownMenu';
import { useMemo } from 'react';

interface ITaskColumnProps {
  data: ColumnWithTasks;
  tasks: Task[];
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

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col justify-start-start gap-4 w-[300px] min-h-[400px] p-2 rounded-md shrink-0',
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
      <SortableContext items={taskIds}>
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
        <Button variant="dashed" className="h-[100px] border-secondary font-semibold">
          Click to add a new task
        </Button>
      </NewTaskDialog>
    </div>
  );
};

export default TaskColumn;

interface IColumnHeaderProps {
  data: ColumnWithTasks;
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
    <div className="flex flex-row items-center group h-8 bg-background rounded-md border hover:border-border duration-200">
      <div
        className="px-2 flex flex-row gap-4 items-center flex-1 cursor-grabbing"
        {...dragAttributes}
        {...dragListeners}
      >
        <div
          className="size-4 rounded-full shrink-0"
          style={{ backgroundColor: data.color }}
        ></div>
        <div className="flex items-center max-w-full">
          <span
            className="text-sm md:text-md font-semibold text-muted-foreground truncate max-w-[110px] md:max-w-[160px] overflow-hidden whitespace-nowrap"
            title={data.name}
          >
            {data.name.length > 30 ? data.name.slice(0, 30) + '...' : data.name}
          </span>
          <b className="font-normal text-muted-foreground text-xs md:text-sm ml-1">
            ({nbTasks})
          </b>
        </div>
      </div>
      <TaskColumnDropdownMenu
        data={data}
        submitColumn={submitColumn}
        deleteItem={deleteItem}
      />
    </div>
  );
};
