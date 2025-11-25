import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error-handler';
import { getUser } from '@/lib/auth-server';
import {
  getProjectWithCards,
  createProjectCard,
  updateProjectCard,
  deleteProjectCard,
  getUserTotalFileSize,
} from './service';
import { parseFormData, toUpdateData } from './utils';
import {
  CreateProjectCardSchema,
  DeleteProjectCardSchema,
  UpdateProjectCardSchema,
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

    const project = await getProjectWithCards(projectId, user.id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
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
    const formData = await request.formData();
    const { name, description, projectId, imageFile } = parseFormData(formData);
    const validatedData = CreateProjectCardSchema.parse({
      name: name || undefined,
      description: description || undefined,
      image: imageFile || undefined,
      projectId: projectId!,
    });

    const projectCard = await createProjectCard(validatedData, user.id, imageFile);

    return NextResponse.json(projectCard, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      statusMap: {
        'Project not found': 404,
        'File too large': 400,
        'User storage limit exceeded': 400,
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
    const formData = await request.formData();
    const raw = parseFormData(formData);
    const data = toUpdateData(raw);

    const validatedData = UpdateProjectCardSchema.parse({
      id: data.id,
      name: data.name || undefined,
      description: data.description || undefined,
      image: raw.imageFile || undefined,
    });
    console.log({ validatedData });

    const projectCard = await updateProjectCard(
      validatedData.id,
      validatedData,
      user.id,
      raw.imageFile,
    );

    return NextResponse.json(projectCard, { status: 200 });
  } catch (error) {
    return handleApiError(error, {
      statusMap: {
        'Project card not found': 404,
        'Project not found': 404,
        Unauthorized: 403,
        'File too large': 400,
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
    return handleApiError(error, {
      statusMap: {
        'Project card not found': 404,
        Unauthorized: 403,
      },
    });
  }
}
