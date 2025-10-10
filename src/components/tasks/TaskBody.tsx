'use client';

import TaskColumn from './TaskColumn';
import TaskHeader from './TaskHeader';
import NewColumnDialog from './dialogs/NewColumnDialog';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { useTasks } from '@/hooks/use-tasks';

const TaskBody = ({ page }: { page: string }) => {
  const { taskColumns, isLoading, fetchTaskColumns } = useTasks(page);

  if (isLoading) return <Spinner size="large" />;

  return (
    <div className="flex flex-col h-full max-h-screen">
      <TaskHeader refreshTaskColumns={() => fetchTaskColumns(page)} pageName={page} />
      <div className="flex-1 overflow-auto">
        <div className="flex flex-row gap-6 p-6 min-w-fit h-full">
          {taskColumns.map((col) => (
            <TaskColumn
              key={col.id}
              data={col}
              refreshTaskColumns={() => fetchTaskColumns(page)}
              pageName={page}
            />
          ))}
          <NewColumnDialog
            refreshTaskColumns={() => fetchTaskColumns(page)}
            pageName={page}
          >
            <Button
              variant="outline"
              className="flex flex-col justify-center w-[300px] h-[500px] bg-transparent border-dashed border-2 border-zinc-700 p-4 text-zinc-500 text-xl mt-12"
            >
              Add Column
            </Button>
          </NewColumnDialog>
        </div>
      </div>
    </div>
  );
};

export default TaskBody;
