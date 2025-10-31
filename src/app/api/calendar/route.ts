import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error-handler';
import { getUser } from '@/lib/auth-server';
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from './service';
import {
  NewCalendarEventSchema,
  UpdateCalendarEventSchema,
  DeleteCalendarEventSchema,
} from './types';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await getCalendarEvents(user.id);
    return NextResponse.json(events, { status: 200 });
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
    const validatedData = NewCalendarEventSchema.parse(body);

    const event = await createCalendarEvent(validatedData, user.id);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = UpdateCalendarEventSchema.parse(body);

    const event = await updateCalendarEvent(validatedData.id, validatedData, user.id);

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    return handleApiError(error, {
      statusMap: {
        'Calendar event not found': 404,
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
    const validatedData = DeleteCalendarEventSchema.parse(body);

    await deleteCalendarEvent(validatedData.id, user.id);

    return NextResponse.json(
      { message: 'Calendar event deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, {
      statusMap: {
        'Calendar event not found': 404,
        Unauthorized: 403,
      },
    });
  }
}
