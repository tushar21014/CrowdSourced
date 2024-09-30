import { S3Client, createPresignedPost } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_SECRET,
  },
  region: "YOUR_AWS_REGION",
});
