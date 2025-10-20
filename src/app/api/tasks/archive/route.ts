import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import z, { ZodError } from 'zod';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = z
      .object({
        id: z.number().min(1, 'Id is required'),
      })
      .parse(body);

    if (!validatedData.id) throw new Error('Id is required');

    await prisma.task.update({
      where: {
        id: validatedData.id,
      },
      data: { archivedAt: new Date(), columnId: null },
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
