import { prisma } from '@/lib/prisma';
import { TaskColumnSelect } from './tasks/types';
import { generateKeyBetween } from 'fractional-indexing';
import { NewColumnType, EditColumnType } from './types';
import { getColumnById } from './utils';

export async function getColumns(userId: string) {
  const columns = await prisma.taskColumn.findMany({
    where: { userId },
    select: TaskColumnSelect,
    orderBy: { order: 'asc' },
  });

  return columns;
}

export async function createColumn(data: NewColumnType, userId: string) {
  if (!data.id) {
    throw new Error('ID is required');
  }

  const firstColumn = await prisma.taskColumn.findFirst({
    where: { userId },
    orderBy: { order: 'desc' },
  });

  const column = await prisma.taskColumn.create({
    data: {
      id: data.id,
      name: data.name,
      color: data.color,
      userId,
      order: generateKeyBetween(firstColumn?.order, null),
    },
  });

  return column;
}

export async function updateColumn(data: EditColumnType, userId: string) {
  const column = await prisma.taskColumn.update({
    where: {
      id: data.id,
      userId, // Ensure user can only update their own columns
    },
    data: {
      name: data.name,
      color: data.color,
    },
  });

  return column;
}

export async function deleteColumn(userId: string, id: string) {
  await prisma.taskColumn.delete({
    where: { userId, id },
  });

  return true;
}

export async function reorderColumns(
  userId: string,
  activeColumnId: string,
  beforeColumnId?: string,
  afterColumnId?: string,
) {
  const activeColumn = await getColumnById(userId, activeColumnId);

  if (!activeColumn) {
    throw new Error('Column not found');
  }

  const afterColumn = await getColumnById(userId, afterColumnId);
  const beforeColumn = await getColumnById(userId, beforeColumnId);

  try {
    const newOrder = generateKeyBetween(
      beforeColumn?.order || null,
      afterColumn?.order || null,
    );

    await prisma.taskColumn.update({
      where: { id: activeColumnId },
      data: { order: newOrder },
    });

    return true;
  } catch (error) {
    console.error('Error in reorderColumns:', error);
    throw error;
  }
}
