import { newTaskSchema } from '@/app/api/columns/tasks/types';
import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = newTaskSchema.parse(body);

    await prisma.task.create({
      data: {
        id: validatedData.id,
        title: validatedData.title,
        description: validatedData.description,
        columnId: column.id,
        order: newOrder,
        userId: user.id,
      },
    });

    return NextResponse.json({ status: 201 });
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newTaskSchema.parse(body);

    if (!validatedData.id) throw new Error('Id is required');

    const updateData: {
      title: string;
      description: string;
      columnId?: string;
    } = {
      title: validatedData.title,
      description: validatedData.description,
    };

    if (validatedData.columnId !== undefined) {
      updateData.columnId = validatedData.columnId;
    }

    await prisma.task.update({
      where: {
        id: validatedData.id,
      },
      data: updateData,
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = z
      .object({
        id: z.string().min(1, 'Id is required'),
      })
      .parse(body);

    await prisma.task.delete({
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
