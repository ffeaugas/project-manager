import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth-server';
import { s3DeleteFolder } from '@/lib/s3';

const newProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

const updateProjectSchema = z.object({
  id: z.number().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
});

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
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
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = newProjectSchema.parse(body);

    const newProject = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ id: newProject.id }, { status: 201 });
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
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    const existingProject = await prisma.project.findUnique({
      where: {
        id: validatedData.id,
        userId: user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: validatedData.id,
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ id: updatedProject.id }, { status: 200 });
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
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await s3DeleteFolder(`${user.id}/projects/${validatedData.id}/`);

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
