import { newColumnSchema, TaskColumnSelect } from '@/components/tasks/types';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { getUser } from '@/lib/auth-server';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const columns = await prisma.taskColumn.findMany({
      where: {
        userId: user.id,
      },
      select: TaskColumnSelect,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(columns);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = newColumnSchema.parse(body);

    const columnCount = await prisma.taskColumn.count({
      where: { userId: user.id },
    });

    await prisma.taskColumn.create({
      data: {
        ...validatedData,
        userId: user.id,
        order: columnCount,
      },
    });

    return NextResponse.json({ status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: e.errors },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = z
      .object({
        id: z.number().min(1, 'Id is required'),
      })
      .parse(body);

    await prisma.taskColumn.delete({
      where: {
        id: validatedData.id,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: e.errors },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = newColumnSchema.parse(body);

    if (!validatedData.id) throw new Error('Id is required');

    await prisma.taskColumn.update({
      where: {
        id: validatedData.id,
        userId: user.id, // Ensure user can only update their own columns
      },
      data: {
        name: validatedData.name,
        color: validatedData.color,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: e.errors },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
