import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-server';
import { reorderTasks } from '../service';
import { reorderTaskSchema } from '../types';
import { handleApiError } from '@/lib/api-error-handler';

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validatedData = reorderTaskSchema.parse(body);

  try {
    await reorderTasks(
      user.id,
      validatedData.activeTaskId,
      validatedData.beforeTaskId,
      validatedData.afterTaskId,
      validatedData.targetColumnId,
    );
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
