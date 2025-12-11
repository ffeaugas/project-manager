import { prisma } from '@/lib/prisma';
import { s3DeleteFolder } from '@/lib/s3';
import { ProjectSelect } from './types';
import { ProjectCategoryKey } from '@prisma/client';

export async function listProjects(userId: string | number) {
  const uid = String(userId);
  const projects = await prisma.project.findMany({
    where: { userId: uid },
    select: ProjectSelect,
    orderBy: { createdAt: 'desc' },
  });

  return projects;
}

export async function createProject(
  userId: string | number,
  data: { name: string; description: string; category?: ProjectCategoryKey },
) {
  const uid = String(userId);
  const created = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description || '',
      category: (data.category ?? 'other') satisfies ProjectCategoryKey,
      userId: uid,
    },
    select: { id: true },
  });
  return created;
}

export async function updateProject(
  userId: string | number,
  id: string,
  data: { name?: string; description: string; category?: ProjectCategoryKey },
) {
  const uid = String(userId);
  const existing = await prisma.project.findUnique({
    where: { id, userId: uid },
    select: { id: true },
  });

  if (!existing) {
    throw new Error('Project not found');
  }

  const updated = await prisma.project.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || '',
      ...(data.category && { category: data.category satisfies ProjectCategoryKey }),
    },
    select: { id: true },
  });

  return updated;
}

export async function deleteProject(userId: string | number, id: string) {
  const uid = String(userId);
  const existing = await prisma.project.findUnique({
    where: { id, userId: uid },
    select: { id: true },
  });

  if (!existing) {
    throw new Error('Project not found');
  }

  await s3DeleteFolder(`${uid}/projects/${id}/`);

  await prisma.project.delete({
    where: { id },
  });
}
