import NewTaskDialog from './dialogs/NewTaskDialog';
import { TaskSelect, NewTaskType } from '../../app/api/columns/tasks/types';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ITaskCardProps {
  data: TaskSelect;
  createTask: (bodyData: Omit<NewTaskType, 'id'>, columnId: string) => Promise<boolean>;
  updateTask: (
    taskId: string,
    bodyData: Omit<NewTaskType, 'id'>,
    columnId?: string,
  ) => Promise<boolean>;
  deleteItem: (id: string, route: string) => Promise<boolean>;
  archiveItem: (id: string) => Promise<boolean>;
}

const TaskCard = ({
  data,
  createTask,
  updateTask,
  deleteItem,
  archiveItem,
}: ITaskCardProps) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: data.id,
      data: {
        type: 'task',
        task: data,
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const date = new Date(data.createdAt);
  const daysAgo = Math.floor(
    (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <NewTaskDialog
      createTask={createTask}
      updateTask={updateTask}
      deleteItem={deleteItem}
      archiveItem={archiveItem}
      data={data}
      columnId={data.columnId ?? ''}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        data-task-card
        className={cn(
          'flex flex-col rounded-md gap-2 px-2 py-2 bg-background min-h-[80px] md:min-h-[100px] max-h-[200px] shadow-md hover:shadow-2xl cursor-pointer justify-between border hover:border-borderColor duration-400',
          isDragging && 'opacity-20',
        )}
      >
        <div className="flex flex-col px-2 gap-1">
          <p className="text-xs md:text-sm font-bold text-foreground wrap-break-words line-clamp-2">
            {data.title}
          </p>
          {data.description && (
            <p className="text-xs md:text-sm text-foreground2 wrap-break-words line-clamp-2 md:line-clamp-4">
              {data.description}
            </p>
          )}
        </div>
        <p className="text-[10px] md:text-xs text-foreground2 text-right">
          {daysAgo} d ago
        </p>
      </div>
    </NewTaskDialog>
  );
};

export default TaskCard;
