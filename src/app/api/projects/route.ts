import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-server';
import { handleApiError } from '@/lib/api-error-handler';
import { createProject, deleteProject, listProjects, updateProject } from './service';
import { DeleteProjectSchema, NewProjectSchema, UpdateProjectSchema } from './types';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await listProjects(user.id);
    return NextResponse.json(projects, { status: 200 });
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
    const validatedData = NewProjectSchema.parse(body);
    const created = await createProject(user.id, validatedData);
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = UpdateProjectSchema.parse(body);
    const updated = await updateProject(user.id, validatedData.id, validatedData);
    return NextResponse.json({ id: updated.id }, { status: 200 });
  } catch (error) {
    return handleApiError(error, { statusMap: { 'Project not found': 404 } });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = DeleteProjectSchema.parse(body);

    await deleteProject(user.id, validatedData.id);

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, { statusMap: { 'Project not found': 404 } });
  }
}
