import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

export function getS3Url(storageKey: string) {
  return `${process.env.R2_URL}/${process.env.AWS_S3_BUCKET_NAME}/${storageKey}`;
}
