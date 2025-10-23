import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { activeColumnId, overColumnId } = await request.json();

    const activeColumn = await prisma.taskColumn.findFirst({
      where: {
        id: activeColumnId,
        userId: user.id, // Ensure user can only reorder their own columns
      },
    });

    const overColumn = await prisma.taskColumn.findFirst({
      where: {
        id: overColumnId,
        userId: user.id, // Ensure user can only reorder their own columns
      },
    });

    if (!activeColumn || !overColumn) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }

    const originalActiveOrder = activeColumn.order;
    const originalOverOrder = overColumn.order;

    if (originalOverOrder > originalActiveOrder) {
      await prisma.taskColumn.updateMany({
        where: {
          userId: user.id,
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
          userId: user.id,
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
  } catch (error) {
    console.error('Error reordering columns:', error);
    return NextResponse.json({ error: 'Failed to reorder columns' }, { status: 500 });
  }
}
