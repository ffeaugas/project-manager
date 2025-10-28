import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-server';
import { handleApiError } from '@/lib/api-error-handler';
import { getColumns, createColumn, updateColumn, deleteColumn } from './service';
import { newColumnSchema, editColumnSchema, deleteColumnSchema } from './types';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const columns = await getColumns(user.id);
    return NextResponse.json(columns);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = newColumnSchema.parse(body);

    const column = await createColumn(validatedData, user.id);

    return NextResponse.json(column, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      statusMap: {
        'ID is required': 400,
      },
    });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = editColumnSchema.parse(body);

    const column = await updateColumn(validatedData, user.id);

    return NextResponse.json(column, { status: 200 });
  } catch (error) {
    return handleApiError(error, {
      statusMap: {
        'Column not found': 404,
        Unauthorized: 403,
      },
    });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = deleteColumnSchema.parse(body);

    await deleteColumn(user.id, validatedData.id);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
