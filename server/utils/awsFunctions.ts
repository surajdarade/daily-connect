import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { S3Client, DeleteObjectsCommand,PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

const s3Config = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_IAM_USER_KEY!,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET!,
  },
});

const generateKey = (prefix: string, file: any) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const key = `${prefix}/${file.fieldname}_${uniqueSuffix}${path.extname(
    file.originalname
  )}`;
  console.log(`Generated S3 Key: ${key}`);
  return key;
};

const generateMediaKey = (prefix: string, filename: string) => {
  if (!filename) {
    throw new Error("Filename is required to generate S3 key.");
  }
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const key = `${prefix}/${uniqueSuffix}${path.extname(filename)}`;
  console.log(`Generated S3 Key: ${key}`);
  return key;
};

const avatarS3Config = {
  s3: s3Config,
  bucket: process.env.AWS_BUCKET_NAME!,
  acl: "public-read",
  metadata: function (req: any, file: any, cb: any) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req: any, file: any, cb: any) {
    cb(null, generateKey("profiles", file));
  },
};

export const uploadAvatar = multer({
  storage: multerS3(avatarS3Config),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB limit
  },
});

export const uploadImageToS3 = async (image: { buffer: ArrayBuffer; filename: string; mimetype: string }) => {
  if (!image.filename || !image.buffer || !image.mimetype) {
    throw new Error("Image data is incomplete. Ensure filename, buffer, and mimetype are provided.");
  }
  
  const key = generateMediaKey("chat/images", image.filename);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(image.buffer),
    ContentType: image.mimetype,
    ACL: "public-read" as ObjectCannedACL,
  };

  const command = new PutObjectCommand(params);
  await s3Config.send(command);
  return `https://${params.Bucket}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;
};

export const uploadVideoToS3 = async (video: { buffer: ArrayBuffer; filename: string; mimetype: string }) => {
  if (!video.filename || !video.buffer || !video.mimetype) {
    throw new Error("Video data is incomplete. Ensure filename, buffer, and mimetype are provided.");
  }
  
  const key = generateMediaKey("chat/videos", video.filename);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(video.buffer),
    ContentType: video.mimetype,
    ACL: "public-read" as ObjectCannedACL,
  };

  const command = new PutObjectCommand(params);
  await s3Config.send(command);
  return `https://${params.Bucket}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;
};

export const deleteFile = async (fileuri: string) => {
  const fileKey = fileuri.split("/").slice(-2).join("/");
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Delete: { Objects: [{ Key: fileKey }] },
  };
  const command = new DeleteObjectsCommand(params);
  return await s3Config.send(command);
};
