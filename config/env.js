const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  GOOGLE_GENAI_API_KEY: z.string(),
  CORS_ORIGIN: z.string()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration");
  console.error(parsed.error.format());
  process.exit(1);
}

module.exports = parsed.data;
