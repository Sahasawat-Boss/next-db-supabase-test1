import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // CLI (migrate / db pull) ใช้การเชื่อมต่อตรง (port 5432) ของ Supabase
  // ส่วนแอปตอนรันจริงใช้ DATABASE_URL (pooler 6543) ผ่าน adapter ใน src/lib/prisma.ts
  datasource: {
    url: env("DIRECT_URL"),
  },
});
