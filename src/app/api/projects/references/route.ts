import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error-handler';
import { getUser } from '@/lib/auth-server';
import {
  getProjectWithReferences,
  createProjectReference,
  updateProjectReference,
  deleteProjectReference,
} from './service';
import {
  NewProjectReferenceSchema,
  UpdateProjectReferenceSchema,
  DeleteProjectReferenceSchema,
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

    const project = await getProjectWithReferences(projectId, user.id);

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
    const body = await request.json();
    const validatedData = NewProjectReferenceSchema.parse(body);

    const projectReference = await createProjectReference(validatedData, user.id);

    return NextResponse.json(projectReference, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      statusMap: {
        'Project not found': 404,
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
    const body = await request.json();
    const validatedData = UpdateProjectReferenceSchema.parse(body);

    const projectReference = await updateProjectReference(
      validatedData.id,
      validatedData,
      user.id,
    );

    return NextResponse.json(projectReference, { status: 200 });
  } catch (error) {
    return handleApiError(error, {
      statusMap: {
        'Project reference not found': 404,
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
    const validatedData = DeleteProjectReferenceSchema.parse(body);

    await deleteProjectReference(validatedData.id, user.id);

    return NextResponse.json(
      { message: 'Project reference deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, {
      statusMap: {
        'Project reference not found': 404,
        Unauthorized: 403,
      },
    });
  }
}
