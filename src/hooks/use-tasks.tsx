import {
  TaskColumnWithTasks,
  NewTaskType,
  NewColumnType,
  TaskSelect,
} from '@/components/tasks/types';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const useTasks = (page: string) => {
  const [taskColumns, setTaskColumns] = useState<TaskColumnWithTasks[]>([]);
  const [overlayTask, setOverlayTask] = useState<TaskSelect | null>(null);
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

  const submitTask = useCallback(
    async (
      bodyData: NewTaskType,
      options?: {
        taskId?: number;
        columnId?: number | null;
        pageName?: string | null;
      },
    ) => {
      try {
        const requestBody: NewTaskType = { ...bodyData, id: options?.taskId };

        if (options?.columnId !== null && options?.columnId !== undefined) {
          requestBody.columnId = options.columnId;
        }
        if (options?.pageName !== null && options?.pageName !== undefined) {
          requestBody.pageName = options.pageName;
        }

        const response = await fetch('/api/tasks', {
          method: options?.taskId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error('Failed to save task');

        await fetchTaskColumns(page);
        return true;
      } catch (e) {
        console.error('Error saving task:', e);
        return false;
      }
    },
    [page, fetchTaskColumns],
  );

  const submitColumn = useCallback(
    async (
      bodyData: NewColumnType,
      options?: {
        columnId?: number;
      },
    ) => {
      try {
        const url = `/api/task-columns?page=${encodeURIComponent(page)}`;

        const response = await fetch(url, {
          method: options?.columnId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...bodyData, id: options?.columnId }),
        });

        if (!response.ok) throw new Error('Failed to save column');

        await fetchTaskColumns(page);
        return true;
      } catch (e) {
        console.error('Error saving column:', e);
        return false;
      }
    },
    [page, fetchTaskColumns],
  );

  const deleteItem = useCallback(
    async (id: number, type: 'task-columns' | 'tasks') => {
      try {
        const response = await fetch(`/api/${type}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Failed to delete item');

        await fetchTaskColumns(page);
        return true;
      } catch (e) {
        console.error('Delete error:', e);
        return false;
      }
    },
    [page, fetchTaskColumns],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setOverlayTask(null);
    const { active, over } = event;
    const tasks = taskColumns.flatMap((column) => column.tasks);
    const activeTask = tasks.find((task) => task.id === active.id);
    if (over && activeTask && activeTask.columnId !== over.id) {
      console.log(`drag task ${activeTask.title} to column ${over.id}`);
      submitTask(activeTask, {
        taskId: activeTask.id,
        columnId: Number(over.id),
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const tasks = taskColumns.flatMap((column) => column.tasks);
    const activeTask = tasks.find((task) => task.id === active.id);
    activeTask && setOverlayTask(activeTask);
  };

  useEffect(() => {
    fetchTaskColumns(page);
  }, [page, fetchTaskColumns]);

  return {
    taskColumns,
    isLoading,
    error,
    fetchTaskColumns,
    submitTask,
    submitColumn,
    deleteItem,
    handleDragStart,
    handleDragEnd,
    overlayTask,
  };
};
