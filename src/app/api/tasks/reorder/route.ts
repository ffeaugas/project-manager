import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { activeTaskId, overTaskId } = await request.json();

    if (!activeTaskId || !overTaskId) {
      return NextResponse.json({ status: 400 });
    }

    const activeTask = await prisma.task.findFirst({
      where: { id: activeTaskId },
    });

    const overTask = await prisma.task.findFirst({
      where: { id: overTaskId },
    });

    if (!activeTask || !overTask) {
      return NextResponse.json({ error: 'Tasks not found' }, { status: 404 });
    }

    const originalActiveOrder = activeTask.order;
    const originalOverOrder = overTask.order;
    const sameColumn = activeTask.columnId === overTask.columnId;

    console.log('originalActiveOrder', originalActiveOrder);
    console.log('originalOverOrder', originalOverOrder);
    console.log('sameColumn', sameColumn);

    if (sameColumn) {
      // Moving within the same column
      if (originalOverOrder > originalActiveOrder) {
        // Moving down
        await prisma.task.updateMany({
          where: {
            columnId: activeTask.columnId,
            order: {
              gt: originalActiveOrder,
              lte: originalOverOrder,
            },
          },
          data: { order: { decrement: 1 } },
        });
      } else {
        // Moving up
        await prisma.task.updateMany({
          where: {
            columnId: activeTask.columnId,
            order: {
              gte: originalOverOrder,
              lt: originalActiveOrder,
            },
          },
          data: { order: { increment: 1 } },
        });
      }
    } else {
      // Moving to a different column
      // Decrement orders in the source column for tasks after the active task
      await prisma.task.updateMany({
        where: {
          columnId: activeTask.columnId,
          order: {
            gt: originalActiveOrder,
          },
        },
        data: { order: { decrement: 1 } },
      });

      // Increment orders in the destination column for tasks at or after the target position
      await prisma.task.updateMany({
        where: {
          columnId: overTask.columnId,
          order: {
            gte: originalOverOrder,
          },
        },
        data: { order: { increment: 1 } },
      });
    }

    await prisma.task.update({
      where: { id: activeTaskId },
      data: { order: originalOverOrder, columnId: overTask.columnId },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
}
