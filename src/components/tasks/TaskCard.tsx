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
  return (
    <NewTaskDialog
      submitTask={submitTask}
      deleteItem={deleteItem}
      data={data}
      columnId={data.columnId}
    >
      <div
        data-task-card
        className="flex flex-col rounded-lg p-4 bg-zinc-700 min-h-[100px] max-h-[200px] justify-center shadow-xl cursor-pointer transition-opacity"
      >
        <p className="text-md font-bold text-white">{data.title}</p>
        <p className="text-sm text-slate-100 break-words line-clamp-3">
          {data.description}
        </p>
      </div>
    </NewTaskDialog>
  );
};

export default TaskCard;
