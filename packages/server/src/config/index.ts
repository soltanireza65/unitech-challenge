import { config } from 'dotenv';
import { z } from "zod";

config();

const schema = z.object({
    DATABASE_URL: z.string(),

    LOG_LEVEL: z.string(),

    PORT: z.string(),
    NODE_ENV: z.string(),
    HOST: z.string(),
})

export type Config = z.infer<typeof schema>;

export const {
    DATABASE_URL,

    LOG_LEVEL,

    PORT,
    NODE_ENV,
    HOST,
} = schema.parse(process.env);