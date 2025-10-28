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
