import { prisma } from '@/lib/prisma';
import { s3UploadFile, s3DeleteFolder } from '@/lib/s3';
import { NewProjectCardType, ProjectSelect } from '@/app/api/projects/cards/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function getProjectWithCards(projectId: string, userId: string) {
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
        url: `${process.env.R2_URL}/${image.storageKey}`,
      })),
    })),
  };
}

export async function createProjectCard(
  data: NewProjectCardType,
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

  const name = data.name?.trim() || undefined;
  const description = data.description?.trim() || undefined;

  const projectCard = await prisma.projectCard.create({
    data: {
      name,
      description,
      projectId: project.id,
    },
  });

  if (imageFile) {
    const storageKey = await s3UploadFile({
      file: imageFile,
      prefix: `${userId}/projects/${data.projectId}/project-cards/${projectCard.id}/`,
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
  id: string,
  data: { name?: string; description?: string; projectId?: string },
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

  const updateData: { name?: string; description?: string; projectId?: string } = {};
  if (data.name !== undefined) {
    updateData.name = data.name.trim() || undefined;
  }
  if (data.description !== undefined) {
    updateData.description = data.description.trim() || undefined;
  }
  if (data.projectId !== undefined) {
    updateData.projectId = data.projectId;
  }

  const finalName = updateData.name !== undefined ? updateData.name : existingCard.name;
  const finalDescription =
    updateData.description !== undefined
      ? updateData.description
      : existingCard.description;
  const willHaveImage = imageFile !== undefined && imageFile !== null;
  const hasExistingImage = existingCard.images.length > 0;

  const hasName = finalName && finalName.trim().length > 0;
  const hasDescription = finalDescription && finalDescription.trim().length > 0;
  const hasImage = willHaveImage || hasExistingImage;

  if (!hasName && !hasDescription && !hasImage) {
    throw new Error('At least one field (name, description, or image) must be provided');
  }

  await prisma.projectCard.update({
    where: { id },
    data: updateData,
  });

  if (imageFile && imageFile.size > 0) {
    await prisma.image.deleteMany({
      where: { projectCardId: id },
    });

    const storageKey = await s3UploadFile({
      file: imageFile,
      prefix: `${userId}/projects/${data.projectId || existingCard.projectId}/project-cards/${id}/`,
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

export async function deleteProjectCard(id: string, userId: string) {
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

  await s3DeleteFolder(
    `${userId}/projects/${existingCard.projectId}/project-cards/${id}/`,
  );

  await prisma.projectCard.delete({
    where: { id },
  });

  return { deletedImagesCount: existingCard.images.length };
}

async function getProjectCardWithUrls(id: string) {
  const card = await prisma.projectCard.findUnique({
    where: { id },
    include: { project: true, images: true },
  });

  if (!card) return null;

  return {
    ...card,
    images: card.images.map((image) => ({
      ...image,
      url: `${process.env.R2_URL}/${image.storageKey}`,
    })),
  };
}
