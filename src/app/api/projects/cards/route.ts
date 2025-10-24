import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth-server';
import { ProjectSelect } from '@/components/project/types';
import { s3UploadFile, getS3Url } from '@/lib/s3';

const newProjectCardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  projectId: z.number().min(1, 'Project ID is required'),
});

const updateProjectCardSchema = z.object({
  id: z.number().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
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

    const projectWithUrls = {
      ...projectCards,
      projectCards: projectCards.projectCards.map((card) => ({
        ...card,
        images: card.images.map((image) => ({
          ...image,
          url: getS3Url(image.storageKey),
        })),
      })),
    };

    return NextResponse.json(projectWithUrls, { status: 200 });
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

    const validatedData = newProjectCardSchema.parse({
      name,
      description,
      projectId: parseInt(projectId),
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

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const newProjectCard = await prisma.projectCard.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        projectId: validatedData.projectId,
      },
    });

    if (imageFile) {
      const storageKey = await s3UploadFile({
        file: imageFile,
        prefix: `${user.id}/projects/${projectId}/project-cards/`,
      });

      await prisma.image.create({
        data: {
          size: imageFile.size,
          mimeType: imageFile.type,
          originalName: imageFile.name,
          storageKey: storageKey,
          projectCardId: newProjectCard.id,
        },
      });
    }

    const completeProjectCard = await prisma.projectCard.findUnique({
      where: { id: newProjectCard.id },
      include: {
        project: true,
        images: true,
      },
    });

    const newProjectCardWithUrls = {
      ...completeProjectCard,
      images: completeProjectCard!.images.map((image) => ({
        ...image,
        url: getS3Url(image.storageKey),
      })),
    };

    return NextResponse.json(newProjectCardWithUrls, { status: 201 });
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
    const formData = await request.formData();

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
        images: true,
      },
    });

    if (!existingProjectCard) {
      return NextResponse.json({ error: 'Project card not found' }, { status: 404 });
    }

    if (existingProjectCard.project.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const validatedData = updateProjectCardSchema.parse({
      id: parseInt(id),
      name: name || undefined,
      description: description || undefined,
      projectId: projectId ? parseInt(projectId) : undefined,
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

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const updateData: {
      name?: string;
      description?: string;
      projectId?: number;
    } = {};

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }

    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
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
        images: true,
      },
    });

    if (imageFile && imageFile.size > 0) {
      await prisma.image.deleteMany({
        where: {
          projectCardId: existingProjectCard.id,
        },
      });

      const storageKey = await s3UploadFile({
        file: imageFile,
        prefix: `${user.id}/projects/${validatedData.projectId || existingProjectCard.projectId}/project-cards/`,
      });

      await prisma.image.create({
        data: {
          size: imageFile.size,
          mimeType: imageFile.type,
          originalName: imageFile.name,
          storageKey: storageKey,
          projectCardId: existingProjectCard.id,
        },
      });
    }

    const finalProjectCard = await prisma.projectCard.findUnique({
      where: {
        id: validatedData.id,
      },
      include: {
        project: true,
        images: true,
      },
    });

    const finalProjectCardWithUrls = {
      ...finalProjectCard,
      images: finalProjectCard!.images.map((image) => ({
        ...image,
        url: getS3Url(image.storageKey),
      })),
    };

    return NextResponse.json(finalProjectCardWithUrls, { status: 200 });
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
        images: true,
      },
    });

    if (!existingProjectCard) {
      return NextResponse.json({ error: 'Project card not found' }, { status: 404 });
    }

    if (existingProjectCard.project.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.projectCard.delete({
      where: {
        id: validatedData.id,
      },
    });

    return NextResponse.json(
      {
        message: 'Project card and associated images deleted successfully',
        deletedImagesCount: existingProjectCard.images.length,
      },
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
