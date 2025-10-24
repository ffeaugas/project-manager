import { prisma } from '@/lib/prisma';
import { s3UploadFile, getS3Url } from '@/lib/s3';
import { ProjectSelect } from '@/components/project/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function getProjectWithCards(projectId: number, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId, userId },
    select: ProjectSelect,
  });

  if (!project) return null;

  return {
    ...project,
    projectCards: project.projectCards.map((card) => ({
      ...card,
      images: card.images.map((image) => ({
        ...image,
        url: getS3Url(image.storageKey),
      })),
    })),
  };
}

export async function createProjectCard(
  data: { name: string; description: string; projectId: number },
  userId: string,
  imageFile?: File | null,
) {
  const project = await prisma.project.findUnique({
    where: { id: data.projectId, userId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (imageFile && imageFile.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }

  const projectCard = await prisma.projectCard.create({
    data: {
      name: data.name,
      description: data.description,
      projectId: data.projectId,
    },
  });

  if (imageFile) {
    const storageKey = await s3UploadFile({
      file: imageFile,
      prefix: `${userId}/projects/${data.projectId}/project-cards/`,
    });

    await prisma.image.create({
      data: {
        size: imageFile.size,
        mimeType: imageFile.type,
        originalName: imageFile.name,
        storageKey,
        projectCardId: projectCard.id,
      },
    });
  }

  return getProjectCardWithUrls(projectCard.id);
}

export async function updateProjectCard(
  id: number,
  data: { name?: string; description?: string; projectId?: number },
  userId: string,
  imageFile?: File | null,
) {
  const existingCard = await prisma.projectCard.findUnique({
    where: { id },
    include: { project: true, images: true },
  });

  if (!existingCard) {
    throw new Error('Project card not found');
  }

  if (existingCard.project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  if (data.projectId !== undefined) {
    const project = await prisma.project.findUnique({
      where: { id: data.projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found');
    }
  }

  if (imageFile && imageFile.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }

  await prisma.projectCard.update({
    where: { id },
    data,
  });

  if (imageFile && imageFile.size > 0) {
    await prisma.image.deleteMany({
      where: { projectCardId: id },
    });

    const storageKey = await s3UploadFile({
      file: imageFile,
      prefix: `${userId}/projects/${data.projectId || existingCard.projectId}/project-cards/`,
    });

    await prisma.image.create({
      data: {
        size: imageFile.size,
        mimeType: imageFile.type,
        originalName: imageFile.name,
        storageKey,
        projectCardId: id,
      },
    });
  }

  return getProjectCardWithUrls(id);
}

export async function deleteProjectCard(id: number, userId: string) {
  const existingCard = await prisma.projectCard.findUnique({
    where: { id },
    include: { project: true, images: true },
  });

  if (!existingCard) {
    throw new Error('Project card not found');
  }

  if (existingCard.project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await prisma.projectCard.delete({
    where: { id },
  });

  return { deletedImagesCount: existingCard.images.length };
}

async function getProjectCardWithUrls(id: number) {
  const card = await prisma.projectCard.findUnique({
    where: { id },
    include: { project: true, images: true },
  });

  if (!card) return null;

  return {
    ...card,
    images: card.images.map((image) => ({
      ...image,
      url: getS3Url(image.storageKey),
    })),
  };
}
