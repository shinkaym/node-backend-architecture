import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Config = {
  region: process.env.AWS_BUCKET_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY
  }
}

const s3 = new S3Client(s3Config)

export { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand }