import { prisma } from '@/lib/prisma';
import {
  s3UploadFile,
  s3DeleteFolder,
  s3GetPresignedUrl,
  getLightStorageKey,
  getMediumStorageKey,
} from '@/lib/s3';
import { ProjectCardType, ProjectSelect } from '@/app/api/projects/cards/types';
import { Image, ProjectCard, ProjectCategoryKey } from '@prisma/client';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const USER_STORAGE_LIMIT = 100 * 1024 * 1024; // 200MB

export async function getProjectWithCards(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId, userId },
    select: ProjectSelect,
  });

  if (!project) return null;

  const projectCardsWithUrls = await Promise.all(
    project.projectCards.map(async (card: ProjectCard) => {
      const imagesWithUrls = await Promise.all(
        card.images.map(async (image: Image) => {
          const url = await s3GetPresignedUrl(image.storageKey);
          const lightStorageKey = getLightStorageKey(image.storageKey);
          const lightUrl = await s3GetPresignedUrl(lightStorageKey);
          const mediumStorageKey = getMediumStorageKey(image.storageKey);
          const mediumUrl = await s3GetPresignedUrl(mediumStorageKey);
          const { storageKey, ...imageWithoutStorageKey } = image;
          return {
            ...imageWithoutStorageKey,
            url,
            lightUrl,
            mediumUrl,
          };
        }),
      );

      return {
        ...card,
        images: imagesWithUrls,
      };
    }),
  );

  return {
    ...project,
    category: project.category as ProjectCategoryKey,
    projectCards: projectCardsWithUrls,
  };
}

export async function createProjectCard(
  data: ProjectCardType,
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

  if (imageFile) {
    const userTotalFileSize = await getUserTotalFileSize(userId);
    console.log({ userTotalFileSize, imageFileSize: imageFile.size });
    if (userTotalFileSize + imageFile.size > USER_STORAGE_LIMIT) {
      throw new Error('User storage limit exceeded');
    }
  }

  const name = data.name?.trim() === '' ? null : data.name?.trim();
  const description =
    data.description.trim() === '<p></p>' || data.description.trim() === ''
      ? null
      : data.description.trim();

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
  data: { name?: string; description: string },
  userId: string,
  imageFile?: File | null,
) {
  const existingCard = await prisma.projectCard.findUnique({
    where: { id, project: { userId } },
    include: { project: true, images: true },
  });

  if (!existingCard) {
    throw new Error('Project card not found');
  }

  if (imageFile && imageFile.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }

  if (imageFile) {
    const userTotalFileSize = await getUserTotalFileSize(userId);
    if (userTotalFileSize + imageFile.size > USER_STORAGE_LIMIT) {
      throw new Error('User storage limit exceeded');
    }
  }

  const description =
    data.description.trim() === '' || data.description === '<p></p>'
      ? null
      : data.description.trim();

  await prisma.projectCard.update({
    where: { id },
    data: {
      name: data.name?.trim() || null,
      description,
    },
  });

  if (imageFile && imageFile.size > 0) {
    await prisma.image.deleteMany({
      where: { projectCardId: id },
    });

    await s3DeleteFolder(
      `${userId}/projects/${existingCard.projectId}/project-cards/${id}/`,
    );

    const storageKey = await s3UploadFile({
      file: imageFile,
      prefix: `${userId}/projects/${existingCard.projectId}/project-cards/${id}/`,
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

export async function getUserTotalFileSize(userId: string) {
  const images = await prisma.image.findMany({
    where: { projectCard: { project: { userId } } },
    select: {
      size: true,
    },
  });

  return images.reduce((acc: number, curr: Image) => acc + curr.size, 0);
}

async function getProjectCardWithUrls(id: string) {
  const card = await prisma.projectCard.findUnique({
    where: { id },
    include: { project: true, images: true },
  });

  if (!card) return null;

  // Generate presigned URLs for all images
  const imagesWithUrls = await Promise.all(
    card.images.map(async (image: Image) => {
      const url = await s3GetPresignedUrl(image.storageKey);
      const lightStorageKey = getLightStorageKey(image.storageKey);
      const lightUrl = await s3GetPresignedUrl(lightStorageKey);
      const mediumStorageKey = getMediumStorageKey(image.storageKey);
      const mediumUrl = await s3GetPresignedUrl(mediumStorageKey);
      return {
        ...image,
        url,
        lightUrl,
        mediumUrl,
      };
    }),
  );

  return {
    ...card,
    images: imagesWithUrls,
  };
}
