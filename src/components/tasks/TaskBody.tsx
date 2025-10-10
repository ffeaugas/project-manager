'use client';

import { useEffect, useState } from 'react';
import TaskColumn from './TaskColumn';
import TaskHeader from './TaskHeader';
import { TaskColumnWithTasks } from './types';
import NewColumnDialog from './dialogs/NewColumnDialog';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const TaskBody = ({ page }: { page: string }) => {
  const [taskColumns, setTaskColumns] = useState<TaskColumnWithTasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchTaskColumns = async () => {
    try {
      const response = await fetch(`/api/task-columns/?page=${page}`);
      if (!response.ok) {
        router.push('/error');
        return;
      }
      const data = await response.json();
      setTaskColumns(data);
    } catch {
      router.push('/error');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskColumns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Spinner size="large" />;

  return (
    <div className="flex flex-col h-full max-h-screen">
      <TaskHeader refreshTaskColumns={fetchTaskColumns} pageName={page} />
      <div className="flex-1 overflow-auto">
        <div className="flex flex-row gap-6 p-6 min-w-fit h-full">
          {taskColumns.map((col) => (
            <TaskColumn
              key={col.id}
              data={col}
              refreshTaskColumns={fetchTaskColumns}
              pageName={page}
            />
          ))}
          <NewColumnDialog refreshTaskColumns={fetchTaskColumns} pageName={page}>
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
