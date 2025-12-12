'use client';

import { useEffect, useState } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import TaskCard from './TaskCard';
import { Spinner } from '../ui/spinner';
import { Task } from '@/app/api/columns/tasks/types';
import TaskHeader from './TaskHeader';
import { ReactNode } from 'react';

interface ArchivedTasksListProps {
  breadcrumbs?: ReactNode;
}

// Todo : refactor and remove the dummy functions
const ArchivedTasksList = ({ breadcrumbs }: ArchivedTasksListProps) => {
  const { fetchArchivedTasks, deleteItem } = useTasks();
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArchivedTasks = async () => {
      setIsLoading(true);
      const tasks = await fetchArchivedTasks();
      setArchivedTasks(tasks || []);
      setIsLoading(false);
    };
    loadArchivedTasks();
  }, [fetchArchivedTasks]);

  const createTask = async () => {
    return false;
  };

  const updateTask = async () => {
    return false;
  };

  const archiveItem = async () => {
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 w-full">
        <TaskHeader breadcrumbs={breadcrumbs} />
        <div className="flex items-center justify-center flex-1">
          <Spinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full">
      <TaskHeader breadcrumbs={breadcrumbs} />
      <div className="overflow-y-auto flex-1 p-4">
        {archivedTasks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No archived tasks
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {archivedTasks.map((task) => (
              <TaskCard
                key={task.id}
                data={task}
                createTask={createTask}
                updateTask={updateTask}
                deleteItem={deleteItem}
                archiveItem={archiveItem}
                isArchived={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedTasksList;
