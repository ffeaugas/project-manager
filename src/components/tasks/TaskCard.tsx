import NewTaskDialog from './dialogs/NewTaskDialog';
import { Task, NewTaskType } from '../../app/api/columns/tasks/types';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';

interface ITaskCardProps {
  data: Task;
  createTask: (bodyData: Omit<NewTaskType, 'id'>, columnId: string) => Promise<boolean>;
  updateTask: (
    taskId: string,
    bodyData: Omit<NewTaskType, 'id'>,
    columnId?: string,
  ) => Promise<boolean>;
  deleteItem: (id: string, route: string) => Promise<boolean>;
  archiveItem: (id: string) => Promise<boolean>;
  isArchived?: boolean;
}

const TaskCard = ({
  data,
  createTask,
  updateTask,
  deleteItem,
  archiveItem,
  isArchived = false,
}: ITaskCardProps) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: data.id,
      data: {
        type: 'task',
        task: data,
      },
      disabled: isArchived,
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const date =
    isArchived && data.archivedAt ? new Date(data.archivedAt) : new Date(data.createdAt);
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
      <Card
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        data-task-card
        className={cn(
          'min-h-[80px] md:min-h-[100px] max-h-[200px] shadow-md hover:shadow-2xl cursor-pointer hover:border-border transition-all duration-400 select-none',
          isDragging && 'opacity-20',
          isArchived && 'h-[150px]',
        )}
      >
        <CardContent className="flex flex-col gap-2 p-3 justify-between h-full">
          <div className="flex flex-col gap-1">
            <p className="text-xs md:text-sm font-bold text-foreground wrap-break-words line-clamp-2">
              {data.title}
            </p>
            {data.description && (
              <p className="text-xs md:text-sm text-muted-foreground wrap-break-words line-clamp-2 md:line-clamp-4">
                {data.description}
              </p>
            )}
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground text-right mt-auto">
            {isArchived ? `Archived ${daysAgo} d ago` : `${daysAgo} d ago`}
          </p>
        </CardContent>
      </Card>
    </NewTaskDialog>
  );
};

export default TaskCard;
