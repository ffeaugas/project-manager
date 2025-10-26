import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  DeleteObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.AWS_S3_API_URL || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

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
