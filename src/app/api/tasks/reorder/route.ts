import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reorderSchema = z.object({
  taskId: z.number(),
  newColumnId: z.number().optional(),
  newOrder: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📨 API RECEIVED - reorder request:', body);

    const { taskId, newColumnId, newOrder } = reorderSchema.parse(body);
    console.log('✅ API PARSED - Validated data:', { taskId, newColumnId, newOrder });

    const currentTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { column: true },
    });

    if (!currentTask) {
      console.log('❌ API ERROR - Task not found:', taskId);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    console.log('📋 API FOUND - Current task:', {
      taskId: currentTask.id,
      currentColumnId: currentTask.columnId,
      currentOrder: currentTask.order,
    });

    const targetColumnId = newColumnId || currentTask.columnId;
    console.log('🎯 API TARGET - Moving to:', { targetColumnId, newOrder });

    if (newColumnId && newColumnId !== currentTask.columnId) {
      await prisma.task.updateMany({
        where: {
          columnId: targetColumnId,
          order: {
            gte: newOrder,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    } else {
      if (newOrder > currentTask.order) {
        await prisma.task.updateMany({
          where: {
            columnId: currentTask.columnId,
            order: {
              gt: currentTask.order,
              lte: newOrder,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });
      } else if (newOrder < currentTask.order) {
        await prisma.task.updateMany({
          where: {
            columnId: currentTask.columnId,
            order: {
              gte: newOrder,
              lt: currentTask.order,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      }
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        columnId: targetColumnId,
        order: newOrder,
      },
    });

    console.log('✅ API SUCCESS - Task updated successfully:', {
      taskId,
      newColumnId: targetColumnId,
      newOrder,
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
