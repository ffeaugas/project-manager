'use client';

import {
  TaskColumnWithTasks,
  NewTaskType,
  TaskSelect,
  EntityType,
} from '@/app/api/columns/tasks/types';
import { NewColumnType } from '@/app/api/columns/types';
import { DragEndEvent, DragStartEvent, Over, Active, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useTasks = () => {
  const [columns, setColumns] = useState<TaskColumnWithTasks[]>([]);
  const [tasks, setTasks] = useState<TaskSelect[]>([]);
  const [overlayTask, setOverlayTask] = useState<TaskSelect | null>(null);
  const [overlayColumn, setOverlayColumn] = useState<TaskColumnWithTasks | null>(null);
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
      setTasks(
        data
          .flatMap((column: TaskColumnWithTasks) => column.tasks)
          .sort((a: TaskSelect, b: TaskSelect) => a.order.localeCompare(b.order)),
      );
    } catch {
      router.push('/error');
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const submitTask = useCallback(
    async (
      bodyData: NewTaskType,
      options?: {
        taskId?: string;
        columnId?: string | null;
      },
    ) => {
      try {
        const requestBody: NewTaskType = { ...bodyData, id: options?.taskId };

        if (options?.columnId !== null && options?.columnId !== undefined) {
          requestBody.columnId = options.columnId;
        }

        let tempTask: TaskSelect | null = null;
        if (!options?.taskId && options?.columnId) {
          const taskId = uuidv4();
          tempTask = {
            id: taskId,
            title: bodyData.title,
            description: bodyData.description,
            columnId: options.columnId,
            order: String(
              tasks.filter((t) => t.columnId === options.columnId).length + 1,
            ),
            createdAt: new Date(),
          };

          setTasks((prev) => [...prev, tempTask!]);
          setColumns((prev) =>
            prev.map((col) =>
              col.id === options.columnId
                ? { ...col, tasks: [...col.tasks, tempTask!] }
                : col,
            ),
          );
        }

        const response = await fetch('/api/tasks', {
          method: options?.taskId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          if (tempTask) {
            setTasks((prev) => prev.filter((t) => t.id !== tempTask!.id));
            setColumns((prev) =>
              prev.map((col) =>
                col.id === tempTask!.columnId
                  ? { ...col, tasks: col.tasks.filter((t) => t.id !== tempTask!.id) }
                  : col,
              ),
            );
          }
          throw new Error('Failed to save task');
        }

        await fetchTaskColumns();
        return true;
      } catch (e) {
        console.error('Error saving task:', e);
        return false;
      }
    },
    [fetchTaskColumns, tasks],
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
    async (id: string, type: EntityType) => {
      try {
        const response = await fetch(`/api/${type}`, {
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
    async (id: string, type: EntityType) => {
      try {
        const response = await fetch(`/api/${type}/archive`, {
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
        tasks[activeIndex].columnId = String(overId);
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
    } catch (e) {
      const previousColumns = arrayMove(newColumns, newIndex, oldIndex);
      setColumns(previousColumns);
      throw new Error('Failed to reorder column');
    }
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
          columnId: String(overId),
        }),
      });
    } else {
      return;
    }

    if (!response.ok) throw new Error('Failed to reorder task');
    await fetchTaskColumns();
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
    submitTask,
    submitColumn,
    deleteItem,
    archiveItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    overlayTask,
    overlayColumn,
  };
};
