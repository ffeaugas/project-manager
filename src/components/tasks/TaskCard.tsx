import { useDraggable } from '@dnd-kit/core';
import NewTaskDialog from './dialogs/NewTaskDialog';
import { TaskSelect, NewTaskType } from './types';

interface ITaskCardProps {
  data: TaskSelect;
  submitTask: (
    bodyData: NewTaskType,
    options?: {
      taskId?: number;
      columnId?: number | null;
      pageName?: string | null;
    },
  ) => Promise<boolean>;
  deleteItem: (id: number, type: 'task-columns' | 'tasks') => Promise<boolean>;
}

const TaskCard = ({ data, submitTask, deleteItem }: ITaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data.id,
  });

  const date = new Date(data.createdAt);
  const daysAgo = Math.floor(
    (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <NewTaskDialog
      submitTask={submitTask}
      deleteItem={deleteItem}
      data={data}
      columnId={data.columnId}
    >
      <div
        ref={setNodeRef}
        style={
          transform
            ? {
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              }
            : undefined
        }
        {...listeners}
        {...attributes}
        data-task-card
        className="flex flex-col rounded-md gap-2 px-2 py-2 bg-zinc-800 min-h-[100px] max-h-[200px] shadow-xl cursor-pointer transition-opacity justify-between"
      >
        <div className="flex flex-col px-2">
          <p className="text-sm font-bold text-white break-words line-clamp-2">
            {data.title}
          </p>
          <p className="text-sm text-slate-100 break-words line-clamp-3">
            {data.description}
          </p>
        </div>
        <p className="text-xs text-slate-400 text-right">{daysAgo} d ago</p>
      </div>
    </NewTaskDialog>
  );
};

export default TaskCard;
