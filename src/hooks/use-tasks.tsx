import {
  TaskColumnWithTasks,
  NewTaskType,
  NewColumnType,
  TaskSelect,
} from '@/components/tasks/types';
import { DragEndEvent, DragStartEvent, Over, Active, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useTasks = (page: string) => {
  const [columns, setColumns] = useState<TaskColumnWithTasks[]>([]);
  const [tasks, setTasks] = useState<TaskSelect[]>([]);
  const [overlayTask, setOverlayTask] = useState<TaskSelect | null>(null);
  const [overlayColumn, setOverlayColumn] = useState<TaskColumnWithTasks | null>(null);
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
        setColumns(data);
        setTasks(
          data
            .flatMap((column: TaskColumnWithTasks) => column.tasks)
            .sort((a: TaskSelect, b: TaskSelect) => a.order - b.order),
        );
        console.log('fetchTaskColumns', data); //TO_REMOVE
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

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'task';
    const isOverTask = over.data.current?.type === 'task';

    if (!isActiveTask) return;

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === 'column';

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[activeIndex].columnId = Number(overId);
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'column') {
      setOverlayColumn(active.data.current.column);
    }
    if (active.data.current?.type === 'task') {
      setOverlayTask(active.data.current.task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setOverlayColumn(null);
    setOverlayTask(null);

    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.type === 'column') {
      reOrderColumn(active, over);
    }

    if (active.data.current?.type === 'task') {
      reOrderTask(active, over);
    }
  };

  const reOrderColumn = async (active: Active, over: Over) => {
    const activeColumnId = active.id;
    const overColumnId = over.id;
    console.log('reOrderColumn', activeColumnId, overColumnId);

    if (activeColumnId === overColumnId) return;

    const oldIndex = columns.findIndex((column) => column.id === activeColumnId);
    const newIndex = columns.findIndex((column) => column.id === overColumnId);
    const newColumns = arrayMove(columns, oldIndex, newIndex);
    setColumns(newColumns);

    const response = await fetch('/api/task-columns/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeColumnId, overColumnId }),
    });

    if (!response.ok) throw new Error('Failed to reorder column');
    await fetchTaskColumns(page);
  };

  const reOrderTask = async (active: Active, over: Over) => {
    const activeTaskId = active.id;
    const overId = over.id;
    const type = over.data.current?.type;
    let response;

    if (activeTaskId === overId) return;

    if (type === 'task') {
      const oldIndex = tasks.findIndex((task) => task.id === activeTaskId);
      const newIndex = tasks.findIndex((task) => task.id === overId);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);

      response = await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeTaskId,
          overTaskId: overId,
        }),
      });
    } else if (type === 'column') {
      const task = tasks.find((t) => t.id === activeTaskId);
      if (!task) return;

      response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeTaskId,
          title: task.title,
          description: task.description,
          columnId: Number(overId),
        }),
      });
    } else {
      return;
    }

    if (!response.ok) throw new Error('Failed to reorder task');
    await fetchTaskColumns(page);
  };

  useEffect(() => {
    fetchTaskColumns(page);
  }, [page, fetchTaskColumns]);

  return {
    columns,
    tasks,
    isLoading,
    error,
    fetchTaskColumns,
    submitTask,
    submitColumn,
    deleteItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    overlayTask,
    overlayColumn,
  };
};
