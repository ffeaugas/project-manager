import { prisma } from '@/lib/prisma';
import { generateKeyBetween } from 'fractional-indexing';
import { NewTaskType } from './types';
import { getTaskById } from '../utils';

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
    description?: string;
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
      userId,
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
  targetColumnId?: string,
  beforeTaskId?: string,
  afterTaskId?: string,
) {
  const activeTask = await getTaskById(userId, activeTaskId);
  let newOrder: string | null = null;

  if (!activeTask) {
    throw new Error('Task not found');
  }

  const beforeTask = await getTaskById(userId, beforeTaskId);
  const afterTask = await getTaskById(userId, afterTaskId);
  newOrder = generateKeyBetween(beforeTask?.order, afterTask?.order);

  await prisma.task.update({
    where: { id: activeTaskId },
    data: { columnId: targetColumnId, order: newOrder },
  });

  return true;
}
