import { TaskColumnWithTasks } from '@/components/tasks/types';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const useTasks = (page: string) => {
  const [taskColumns, setTaskColumns] = useState<TaskColumnWithTasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const router = useRouter();

  const fetchTaskColumns = useCallback(
    async (page: string) => {
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
    },
    [router],
  );

  useEffect(() => {
    fetchTaskColumns(page);
  }, [page, fetchTaskColumns]);

  return { taskColumns, isLoading, error, fetchTaskColumns };
};
