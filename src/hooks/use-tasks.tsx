'use client';

import {
  TaskColumnWithTasks,
  NewTaskType,
  TaskSelect,
} from '@/app/api/columns/tasks/types';
import { NewColumnType } from '@/app/api/columns/types';
import {
  DragEndEvent,
  DragStartEvent,
  Over,
  Active,
  DragOverEvent,
  DataRef,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { generateKeyBetween } from 'fractional-indexing';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useTasks = () => {
  const [columns, setColumns] = useState<TaskColumnWithTasks[]>([]);
  const [tasks, setTasks] = useState<TaskSelect[]>([]);
  const [activeTask, setActiveTask] = useState<TaskSelect | null>(null);
  const [activeColumn, setActiveColumn] = useState<TaskColumnWithTasks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const router = useRouter();

  const fetchTaskColumns = useCallback(async () => {
    try {
      const response = await fetch(`/api/columns`);
      if (!response.ok) {
        router.push('/error');
        return;
      }
      const data = await response.json();
      setColumns(data);
      setTasks(data.flatMap((column: TaskColumnWithTasks) => column.tasks));
    } catch {
      router.push('/error');
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const createTask = useCallback(
    async (bodyData: Omit<NewTaskType, 'id'>, columnId: string) => {
      try {
        const taskId = uuidv4();

        // Calculate order for new task
        const tasksInColumn = tasks.filter((t) => t.columnId === columnId);
        const afterTask = tasksInColumn[tasksInColumn.length + 1];
        const beforeTask = tasksInColumn[tasksInColumn.length - 1];

        const newOrder = generateKeyBetween(beforeTask?.order, afterTask?.order);

        // Optimistic update
        const tempTask = {
          id: taskId,
          title: bodyData.title,
          description: bodyData.description,
          columnId,
          order: newOrder,
          createdAt: new Date(),
        };

        setTasks((prev) => [...prev, tempTask]);
        setColumns((prev) =>
          prev.map((col) =>
            col.id === columnId ? { ...col, tasks: [...col.tasks, tempTask] } : col,
          ),
        );

        const response = await fetch('/api/columns/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tempTask),
        });

        if (!response.ok) {
          // Rollback on error
          setTasks((prev) => prev.filter((t) => t.id !== tempTask.id));
          setColumns((prev) =>
            prev.map((col) =>
              col.id === columnId
                ? { ...col, tasks: col.tasks.filter((t) => t.id !== tempTask.id) }
                : col,
            ),
          );
          throw new Error('Failed to create task');
        }

        await fetchTaskColumns();
        return true;
      } catch (e) {
        console.error('Error creating task:', e);
        return false;
      }
    },
    [fetchTaskColumns, tasks],
  );

  const updateTask = useCallback(
    async (taskId: string, bodyData: Omit<NewTaskType, 'id'>, columnId?: string) => {
      try {
        const requestBody: NewTaskType = { ...bodyData, id: taskId, columnId };

        const response = await fetch('/api/columns/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Failed to update task');
        }

        await fetchTaskColumns();
        return true;
      } catch (e) {
        console.error('Error updating task:', e);
        return false;
      }
    },
    [fetchTaskColumns],
  );

  const submitColumn = useCallback(
    async (
      bodyData: NewColumnType,
      options?: {
        columnId?: string;
      },
    ) => {
      try {
        const url = `/api/columns`;

        let tempColumn: TaskColumnWithTasks | null = null;
        let requestBody: NewColumnType | (NewColumnType & { id: string });

        if (!options?.columnId) {
          const columnId = uuidv4();
          tempColumn = {
            id: columnId,
            name: bodyData.name,
            color: bodyData.color,
            order: String(columns.length),
            tasks: [],
          };

          setColumns((prev) => [...prev, tempColumn!]);
          requestBody = { ...bodyData, id: columnId };
        } else {
          requestBody = { ...bodyData, id: options.columnId };
        }

        const response = await fetch(url, {
          method: options?.columnId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          if (tempColumn) {
            setColumns((prev) => prev.filter((col) => col.id !== tempColumn!.id));
          }
          throw new Error('Failed to save column');
        }

        await fetchTaskColumns();
        return true;
      } catch (e) {
        console.error('Error saving column:', e);
        return false;
      }
    },
    [fetchTaskColumns, columns],
  );

  const deleteItem = useCallback(
    async (id: string, route: string) => {
      try {
        const response = await fetch(`/api/${route}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Failed to delete item');

        await fetchTaskColumns();
        return true;
      } catch (e) {
        console.error('Delete error:', e);
        return false;
      }
    },
    [fetchTaskColumns],
  );

  const archiveItem = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/columns/tasks/archive`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Failed to archive item');

        await fetchTaskColumns();
        return true;
      } catch (e) {
        console.error('Archive error:', e);
        return false;
      }
    },
    [fetchTaskColumns],
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'task';
    const isOverATask = overData?.type === 'task';

    if (!isActiveATask) return;

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (activeTask && overTask && activeTask.columnId !== overTask.columnId) {
          activeTask.columnId = overTask.columnId;
          return arrayMove(tasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === 'column';

    // Dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.columnId = overId as string;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'column') {
      setActiveColumn(active.data.current.column);
    }
    if (active.data.current?.type === 'task') {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;
    if (!hasDraggableData(over)) return;

    const activeData = active.data.current;

    if (activeData?.type === 'task') {
      reOrderTask(active);
    }

    if (activeId === overId) return;

    if (activeData?.type === 'column') {
      reOrderColumn(active, over);
    }
  };

  const reOrderColumn = async (active: Active, over: Over) => {
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    const oldIndex = columns.findIndex((column) => column.id === activeColumnId);
    const newIndex = columns.findIndex((column) => column.id === overColumnId);
    const newColumns = arrayMove(columns, oldIndex, newIndex);
    setColumns(newColumns);

    try {
      const afterColumn = newColumns[newIndex + 1];
      const beforeColumn = newColumns[newIndex - 1];
      await fetch('/api/columns/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeColumnId,
          afterColumnId: afterColumn?.id,
          beforeColumnId: beforeColumn?.id,
        }),
      });
    } catch {
      const previousColumns = arrayMove(newColumns, newIndex, oldIndex);
      setColumns(previousColumns);
      throw new Error('Failed to reorder column');
    }
  };

  const reOrderTask = async (active: Active) => {
    const activeTaskId = active.id;
    const tasksInColumn = tasks.filter(
      (t) => t.columnId === active.data.current?.task?.columnId,
    );
    const activeTaskIndex = tasksInColumn.findIndex((t) => t.id === activeTaskId);
    const beforeTask = tasksInColumn[activeTaskIndex - 1];
    const afterTask = tasksInColumn[activeTaskIndex + 1];
    try {
      await fetch('/api/columns/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeTaskId,
          targetColumnId: active.data.current?.task?.columnId,
          beforeTaskId: beforeTask?.id,
          afterTaskId: afterTask?.id,
        }),
      });
    } catch {
      fetchTaskColumns();
      throw new Error('Failed to reorder task');
    }
  };

  useEffect(() => {
    fetchTaskColumns();
  }, [fetchTaskColumns]);

  return {
    columns,
    tasks,
    isLoading,
    error,
    fetchTaskColumns,
    createTask,
    updateTask,
    submitColumn,
    deleteItem,
    archiveItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    activeTask,
    activeColumn,
  };
};

function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<{
    type: 'column' | 'task';
    column?: TaskColumnWithTasks;
    task?: TaskSelect;
  }>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'column' || data?.type === 'task') {
    return true;
  }

  return false;
}
