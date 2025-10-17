import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(16),
  EMAIL_SERVER: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  REDIS_URL: z.string().url().optional(),
  ONESIGNAL_API_KEY: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET_URL: z.string().url().optional(),
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  EMAIL_SERVER: process.env.EMAIL_SERVER,
  EMAIL_FROM: process.env.EMAIL_FROM,
  REDIS_URL: process.env.REDIS_URL,
  ONESIGNAL_API_KEY: process.env.ONESIGNAL_API_KEY,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_BUCKET_URL: process.env.S3_BUCKET_URL,
});
