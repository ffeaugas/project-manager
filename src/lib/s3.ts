import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  DeleteObjectsCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';

export const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.AWS_S3_API_URL || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

async function generateLightVersion(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .rotate(0)
    .resize({
      width: 50,
      height: 50,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 50 })
    .toBuffer();
}

async function generateMediumVersion(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .rotate(0)
    .resize({
      width: 400,
      height: 400,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 90 })
    .toBuffer();
}

export async function s3UploadFile(params: { file: File; prefix: string }) {
  const fileBuffer = await params.file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  const fileExtension = params.file.name.split('.').pop();
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
  const key = `${params.prefix}${uniqueFilename}`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: key,
    Body: buffer,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  const lightBuffer = await generateLightVersion(buffer);
  const lightKey = key.replace(`.${fileExtension}`, `-light.jpg`);

  const lightUploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: lightKey,
    Body: lightBuffer,
  };

  const lightCommand = new PutObjectCommand(lightUploadParams);
  await s3.send(lightCommand);

  const mediumBuffer = await generateMediumVersion(buffer);
  const mediumKey = key.replace(`.${fileExtension}`, `-medium.jpg`);

  const mediumUploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: mediumKey,
    Body: mediumBuffer,
  };

  const mediumCommand = new PutObjectCommand(mediumUploadParams);
  await s3.send(mediumCommand);

  return key;
}

export async function s3DeleteFile(storageKey: string) {
  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: storageKey,
  };

  const command = new DeleteObjectCommand(deleteParams);
  await s3.send(command);
}

export async function s3DeleteFolder(folder: string) {
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Prefix: folder,
      ContinuationToken: continuationToken,
    });

    const listResponse: ListObjectsV2CommandOutput = (await s3.send(
      command,
    )) as ListObjectsV2CommandOutput;

    if (listResponse.Contents && listResponse.Contents.length > 0) {
      const objectsToDelete = listResponse.Contents.filter(
        (obj) => obj.Key !== undefined,
      ).map((obj) => ({ Key: obj.Key! }));

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME || '',
        Delete: {
          Objects: objectsToDelete,
          Quiet: true,
        },
      });

      await s3.send(deleteCommand);
    }

    continuationToken = listResponse.NextContinuationToken;
  } while (continuationToken);
}

export async function s3GetPresignedUrl(
  storageKey: string,
  expiresIn: number = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: storageKey,
  });

  const url = await getSignedUrl(s3, command, { expiresIn });
  return url;
}

/**
 * Génère la clé de stockage pour la version light d'une image
 * La version light est toujours en .jpg pour réduire la taille
 */
export function getLightStorageKey(storageKey: string): string {
  const lastDotIndex = storageKey.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${storageKey}-light.jpg`;
  }
  return `${storageKey.slice(0, lastDotIndex)}-light.jpg`;
}

/**
 * Génère la clé de stockage pour la version medium d'une image
 * La version medium est toujours en .jpg pour réduire la taille
 */
export function getMediumStorageKey(storageKey: string): string {
  const lastDotIndex = storageKey.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${storageKey}-medium.jpg`;
  }
  return `${storageKey.slice(0, lastDotIndex)}-medium.jpg`;
}
