import { prisma } from '@/lib/prisma';

import {
  NewProjectReferenceType,
  ProjectReferenceSelect,
  UpdateProjectReferenceType,
} from './types';

export async function getProjectReferences(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId, userId },
    select: {
      projectReferences: {
        select: ProjectReferenceSelect,
      },
    },
  });

  if (!project) return null;

  return project.projectReferences;
}

export async function createProjectReference(
  data: NewProjectReferenceType,
  userId: string,
) {
  const project = await prisma.project.findUnique({
    where: { id: data.projectId, userId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const projectReference = await prisma.projectReference.create({
    data: {
      name: data.name,
      description: data.description || '',
      url: data.url || '',
      projectId: project.id,
    },
    select: ProjectReferenceSelect,
  });

  return projectReference;
}

export async function updateProjectReference(
  id: string,
  data: UpdateProjectReferenceType,
  userId: string,
) {
  const existingReference = await prisma.projectReference.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!existingReference) {
    throw new Error('Project reference not found');
  }

  if (existingReference.project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const updated = await prisma.projectReference.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      url: data.url,
    },
    select: ProjectReferenceSelect,
  });

  return updated;
}

export async function deleteProjectReference(id: string, userId: string) {
  const existingReference = await prisma.projectReference.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!existingReference) {
    throw new Error('Project reference not found');
  }

  if (existingReference.project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await prisma.projectReference.delete({
    where: { id },
  });

  return { message: 'Project reference deleted successfully' };
}
