import { newPageSchema } from '@/components/tasks/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newPageSchema.parse(body);

    await prisma.page.create({
      data: validatedData,
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

    await prisma.page.delete({
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
    const body = await request.json();
    const validatedData = newPageSchema.parse(body);

    if (!validatedData.id) throw new Error('Id is required');

    await prisma.page.update({
      where: {
        id: validatedData.id,
      },
      data: {
        name: validatedData.name,
        icon: validatedData.icon,
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
