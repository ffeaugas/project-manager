import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { activeColumnId, overColumnId } = await request.json();

  const activeColumn = await prisma.taskColumn.findFirst({
    where: { id: activeColumnId },
  });

  const overColumn = await prisma.taskColumn.findFirst({
    where: { id: overColumnId },
  });

  if (!activeColumn || !overColumn) {
    throw new Error('Column not found');
  }

  const originalActiveOrder = activeColumn.order;
  const originalOverOrder = overColumn.order;

  if (originalOverOrder > originalActiveOrder) {
    await prisma.taskColumn.updateMany({
      where: {
        pageId: overColumn.pageId,
        order: {
          gt: originalActiveOrder,
          lte: originalOverOrder,
        },
      },
      data: { order: { decrement: 1 } },
    });
  } else {
    await prisma.taskColumn.updateMany({
      where: {
        pageId: overColumn.pageId,
        order: {
          gte: originalOverOrder,
          lt: originalActiveOrder,
        },
      },
      data: { order: { increment: 1 } },
    });
  }

  await prisma.taskColumn.update({
    where: { id: activeColumnId },
    data: { order: originalOverOrder },
  });

  return NextResponse.json({ status: 200 });
}
