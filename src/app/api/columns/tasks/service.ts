import { prisma } from '@/lib/prisma';
import { generateKeyBetween } from 'fractional-indexing';
import { NewTaskType } from './types';

export async function getTaskById(userId: string, id: string) {
  const task = await prisma.task.findFirst({
    where: { id, userId },
  });
  return task;
}

export async function createTask(data: NewTaskType, userId: string, columnId: string) {
  if (!data.id) {
    throw new Error('ID is required');
  }

  // Get the last task in the column to calculate order
  const lastTask = await prisma.task.findFirst({
    where: {
      columnId,
      userId,
      archivedAt: null,
    },
    orderBy: { order: 'desc' },
  });

  const order = generateKeyBetween(lastTask?.order, null);

  const task = await prisma.task.create({
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
      columnId,
      order,
      userId,
    },
  });

  return task;
}

export async function updateTask(data: NewTaskType, userId: string) {
  if (!data.id) {
    throw new Error('ID is required');
  }

  const updateData: {
    title: string;
    description: string;
    columnId?: string;
  } = {
    title: data.title,
    description: data.description,
  };

  if (data.columnId !== undefined) {
    updateData.columnId = data.columnId;
  }

  const task = await prisma.task.update({
    where: {
      id: data.id,
      userId, // Ensure user can only update their own tasks
    },
    data: updateData,
  });

  return task;
}

export async function deleteTask(userId: string, id: string) {
  await prisma.task.delete({
    where: { id, userId },
  });

  return true;
}

export async function archiveTask(userId: string, id: string) {
  const task = await prisma.task.update({
    where: { id, userId },
    data: { archivedAt: new Date() },
  });

  return task;
}

export async function reorderTasks(
  userId: string,
  activeTaskId: string,
  beforeTaskId?: string,
  afterTaskId?: string,
  targetColumnId?: string,
) {
  const activeTask = await getTaskById(userId, activeTaskId);

  if (!activeTask) {
    throw new Error('Task not found');
  }

  const targetColumn = targetColumnId || activeTask.columnId;

  // Get tasks in the target column ordered by order field (excluding the active task)
  const tasksInColumn = await prisma.task.findMany({
    where: {
      columnId: targetColumn,
      userId,
      archivedAt: null,
      NOT: {
        id: activeTaskId, // Exclude the active task from the list
      },
    },
    orderBy: { order: 'asc' },
  });

  // Find the tasks we're inserting between
  const beforeTask = beforeTaskId
    ? tasksInColumn.find((t) => t.id === beforeTaskId)
    : null;
  const afterTask = afterTaskId ? tasksInColumn.find((t) => t.id === afterTaskId) : null;

  const newOrder = generateKeyBetween(
    beforeTask?.order || null,
    afterTask?.order || null,
  );

  console.log({
    activeTaskId,
    beforeTask: beforeTask?.order,
    afterTask: afterTask?.order,
    newOrder,
    targetColumn,
  });

  await prisma.task.update({
    where: { id: activeTaskId },
    data: {
      order: newOrder,
      columnId: targetColumn,
    },
  });

  return true;
}
