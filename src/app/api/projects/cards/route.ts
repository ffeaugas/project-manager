import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getUser } from '@/lib/auth-server';
import {
  getProjectWithCards,
  createProjectCard,
  updateProjectCard,
  deleteProjectCard,
} from './service';
import { parseFormData, toUpdateData } from './utils';
import {
  NewProjectCardSchema,
  UpdateProjectCardSchema,
  DeleteProjectCardSchema,
} from './types';

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projectId = request.nextUrl.searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const project = await getProjectWithCards(parseInt(projectId), user.id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
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
    const { name, description, projectId, imageFile } = parseFormData(formData);

    const validatedData = NewProjectCardSchema.parse({
      name,
      description,
      projectId: parseInt(projectId!),
    });

    const projectCard = await createProjectCard(validatedData, user.id, imageFile);

    return NextResponse.json(projectCard, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      const statusMap: Record<string, number> = {
        'Project not found': 404,
        'File too large': 400,
      };

      return NextResponse.json(
        { error: error.message },
        { status: statusMap[error.message] || 500 },
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
    const raw = parseFormData(formData);
    const data = toUpdateData(raw);

    const validatedData = UpdateProjectCardSchema.parse(data);

    const projectCard = await updateProjectCard(
      validatedData.id,
      validatedData,
      user.id,
      raw.imageFile,
    );

    return NextResponse.json(projectCard, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      const statusMap: Record<string, number> = {
        'Project card not found': 404,
        'Project not found': 404,
        Unauthorized: 403,
        'File too large': 400,
      };

      return NextResponse.json(
        { error: error.message },
        { status: statusMap[error.message] || 500 },
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
    const validatedData = DeleteProjectCardSchema.parse(body);

    const result = await deleteProjectCard(validatedData.id, user.id);

    return NextResponse.json(
      {
        message: 'Project card and associated images deleted successfully',
        deletedImagesCount: result.deletedImagesCount,
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

    if (error instanceof Error) {
      const statusMap: Record<string, number> = {
        'Project card not found': 404,
        Unauthorized: 403,
      };

      return NextResponse.json(
        { error: error.message },
        { status: statusMap[error.message] || 500 },
      );
    }

    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
