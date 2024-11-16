import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  ADMIN_USER_ID: z.string(),
});

export const env = envSchema.parse({
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_USER_ID: process.env.ADMIN_USER_ID,
});