import { prisma } from '@/lib/prisma';

export const getColumnById = async (userId: string, id?: string) => {
  if (!id) {
    return null;
  }

  const column = await prisma.taskColumn.findFirst({
    where: { id, userId },
  });
  return column;
};

export const getTaskById = async (userId: string, id?: string) => {
  if (!id) {
    return null;
  }

  const task = await prisma.task.findFirst({
    where: { id, userId },
  });
  return task;
};
