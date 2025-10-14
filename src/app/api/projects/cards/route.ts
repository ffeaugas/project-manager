import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newProjectCardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  projectId: z.number().min(1, 'Project ID is required'),
});

const updateProjectCardSchema = z.object({
  id: z.number().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  imageUrl: z.string().min(1, 'Image is required').optional(),
  projectId: z.number().min(1, 'Project ID is required').optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const projectId = searchParams.get('projectId');

    if (id) {
      const projectCard = await prisma.projectCard.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          project: true,
        },
      });

      if (!projectCard) {
        return NextResponse.json({ error: 'Project card not found' }, { status: 404 });
      }

      return NextResponse.json(projectCard, { status: 200 });
    } else if (projectId) {
      const projectCards = await prisma.projectCard.findMany({
        where: {
          projectId: parseInt(projectId),
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          project: true,
        },
      });

      return NextResponse.json(projectCards, { status: 200 });
    } else {
      const projectCards = await prisma.projectCard.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          project: true,
        },
      });

      return NextResponse.json(projectCards, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newProjectCardSchema.parse(body);

    const project = await prisma.project.findUnique({
      where: {
        id: validatedData.projectId,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const newProjectCard = await prisma.projectCard.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        projectId: validatedData.projectId,
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(newProjectCard, { status: 201 });
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
  try {
    const body = await request.json();
    const validatedData = updateProjectCardSchema.parse(body);

    const existingProjectCard = await prisma.projectCard.findUnique({
      where: {
        id: validatedData.id,
      },
    });

    if (!existingProjectCard) {
      return NextResponse.json({ error: 'Project card not found' }, { status: 404 });
    }

    if (validatedData.projectId !== undefined) {
      const project = await prisma.project.findUnique({
        where: {
          id: validatedData.projectId,
        },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
    }

    const updateData: {
      name?: string;
      description?: string;
      imageUrl?: string;
      projectId?: number;
    } = {};

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }

    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
    }

    if (validatedData.imageUrl !== undefined) {
      updateData.imageUrl = validatedData.imageUrl;
    }

    if (validatedData.projectId !== undefined) {
      updateData.projectId = validatedData.projectId;
    }

    const updatedProjectCard = await prisma.projectCard.update({
      where: {
        id: validatedData.id,
      },
      data: updateData,
      include: {
        project: true,
      },
    });

    return NextResponse.json(updatedProjectCard, { status: 200 });
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

    const existingProjectCard = await prisma.projectCard.findUnique({
      where: {
        id: validatedData.id,
      },
    });

    if (!existingProjectCard) {
      return NextResponse.json({ error: 'Project card not found' }, { status: 404 });
    }

    await prisma.projectCard.delete({
      where: {
        id: validatedData.id,
      },
    });

    return NextResponse.json(
      { message: 'Project card deleted successfully' },
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
