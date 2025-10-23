import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth-server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { ProjectSelect } from '@/components/project/types';

const newProjectCardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().optional(),
  projectId: z.number().min(1, 'Project ID is required'),
});

const updateProjectCardSchema = z.object({
  id: z.number().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  imageUrl: z.string().optional(),
  projectId: z.number().min(1, 'Project ID is required').optional(),
});

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const projectCards = await prisma.project.findUnique({
      where: {
        id: parseInt(projectId),
        userId: user.id,
      },
      select: ProjectSelect,
    });

    if (!projectCards) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(projectCards, { status: 200 });
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
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const projectId = formData.get('projectId') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl: string | undefined = undefined;

    // Handle image upload if present
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = imageFile.name.split('.').pop();
      const filename = `project-${projectId}-card-${timestamp}.${fileExtension}`;

      // Save to public/upload directory
      const uploadDir = join(process.cwd(), 'public', 'upload');
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imageUrl = `/upload/${filename}`;
    }

    const validatedData = newProjectCardSchema.parse({
      name,
      description,
      projectId: parseInt(projectId),
      imageUrl,
    });

    const project = await prisma.project.findUnique({
      where: {
        id: validatedData.projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const newProjectCard = await prisma.projectCard.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        ...(validatedData.imageUrl && { imageUrl: validatedData.imageUrl }),
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
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const formData = await body.formData();

    const id = formData.get('id') as string;
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const projectId = formData.get('projectId') as string | null;
    const imageFile = formData.get('image') as File | null;

    const existingProjectCard = await prisma.projectCard.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        project: true,
      },
    });

    if (!existingProjectCard) {
      return NextResponse.json({ error: 'Project card not found' }, { status: 404 });
    }

    // Check if the user owns the project that contains this card
    if (existingProjectCard.project.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let imageUrl: string | undefined = undefined;

    // Handle image upload if present
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = imageFile.name.split('.').pop();
      const filename = `project-${projectId || existingProjectCard.projectId}-card-${timestamp}.${fileExtension}`;

      // Save to public/upload directory
      const uploadDir = join(process.cwd(), 'public', 'upload');
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imageUrl = `/upload/${filename}`;
    }

    const validatedData = updateProjectCardSchema.parse({
      id: parseInt(id),
      name: name || undefined,
      description: description || undefined,
      projectId: projectId ? parseInt(projectId) : undefined,
      imageUrl: imageUrl || undefined,
    });

    if (validatedData.projectId !== undefined) {
      const project = await prisma.project.findUnique({
        where: {
          id: validatedData.projectId,
          userId: user.id,
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

    const existingProjectCard = await prisma.projectCard.findUnique({
      where: {
        id: validatedData.id,
      },
      include: {
        project: true,
      },
    });

    if (!existingProjectCard) {
      return NextResponse.json({ error: 'Project card not found' }, { status: 404 });
    }

    // Check if the user owns the project that contains this card
    if (existingProjectCard.project.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
