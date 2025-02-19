import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.js",  // Path to your schema file
  out: "./migrations",           // Where migrations will be stored
  dialect: "postgresql", // ✅ Correct
  // PostgreSQL as the database
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_fZi8V2eRNGHx@ep-purple-frog-a5x9ndk9-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require", // Use quotes for a string
  },
});
