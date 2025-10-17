import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getUser } from '@/lib/auth-server';

const prisma = new PrismaClient();

const newProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

const updateProjectSchema = z.object({
  id: z.number().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
});

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newProjectSchema.parse(body);

    const newProject = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = z
      .object({
        id: z.number().min(1, 'Id is required'),
      })
      .parse(body);

    const existingProject = await prisma.project.findUnique({
      where: {
        id: validatedData.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({
      where: {
        id: validatedData.id,
      },
    });

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 },
    );
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
