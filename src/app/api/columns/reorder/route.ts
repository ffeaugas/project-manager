import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-server';
import { reorderColumns } from '../service';
import { reorderColumnSchema } from '../types';
import { handleApiError } from '@/lib/api-error-handler';

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validatedData = reorderColumnSchema.parse(body);

  try {
    await reorderColumns(
      user.id,
      validatedData.activeColumnId,
      validatedData.beforeColumnId,
      validatedData.afterColumnId,
    );
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
