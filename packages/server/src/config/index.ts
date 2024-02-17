import { config } from 'dotenv';
import { z } from "zod";

config();

const schema = z.object({
    DATABASE_URL: z.string(),
    APP_URL: z.string(),

    LOG_LEVEL: z.string(),

    PORT: z.string(),
    NODE_ENV: z.string(),
    HOST: z.string(),
    JWT_SECRET: z.string(),

    MAILER_USER: z.string(),
    MAILER_PASS: z.string(),
    MAILER_HOST: z.string(),
    MAILER_PORT: z.string(),
    MAILER_SECURE: z.string(),

    ACCESS_TOKEN_PUBLIC_KEY: z.string(),
    ACCESS_TOKEN_PRIVATE_KEY: z.string(),
    REFRESH_PUBLIC_KEY: z.string(),
    REFRESH_PRIVATE_KEY: z.string(),
})

export type Config = z.infer<typeof schema>;

export const {
    DATABASE_URL,
    APP_URL,

    LOG_LEVEL,

    PORT,
    NODE_ENV,
    HOST,
    JWT_SECRET,

    MAILER_HOST,
    MAILER_PASS,
    MAILER_PORT,
    MAILER_SECURE,
    MAILER_USER,

    ACCESS_TOKEN_PRIVATE_KEY,
    ACCESS_TOKEN_PUBLIC_KEY,
    REFRESH_PRIVATE_KEY,
    REFRESH_PUBLIC_KEY
} = schema.parse(process.env);