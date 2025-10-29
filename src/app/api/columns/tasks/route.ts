import { newTaskSchema } from '@/app/api/columns/tasks/types';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUser } from '@/lib/auth-server';
import { createTask, updateTask, deleteTask } from './service';
import { handleApiError } from '@/lib/api-error-handler';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = newTaskSchema.parse(body);

    if (!validatedData.columnId) {
      throw new Error('columnId is required');
    }

    await createTask(validatedData, user.id, validatedData.columnId);

    return NextResponse.json({ status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = newTaskSchema.parse(body);

    if (!validatedData.id) throw new Error('Id is required');

    await updateTask(validatedData, user.id);

    return NextResponse.json({ status: 200 });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(request: NextRequest) {
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

    await deleteTask(user.id, validatedData.id);

    return NextResponse.json({ status: 200 });
  } catch (e) {
    return handleApiError(e);
  }
}
