import { NextRequest, NextResponse } from 'next/server';
import z, { ZodError } from 'zod';
import { getUser } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { getArchivedTasks } from '../service';
import { handleApiError } from '@/lib/api-error-handler';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = z
      .object({
        id: z.string().min(1, 'Id is required'),
      })
      .parse(body);

    if (!validatedData.id) throw new Error('Id is required');

    await prisma.task.update({
      where: {
        id: validatedData.id,
        userId: user.id,
      },
      data: { archivedAt: new Date(), columnId: null },
    });

    return NextResponse.json({ status: 200 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: e.issues },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await getArchivedTasks(user.id);
    return NextResponse.json(tasks);
  } catch (e) {
    return handleApiError(e);
  }
}
