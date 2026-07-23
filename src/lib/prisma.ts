import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma Client (เดี่ยว) สำหรับใช้งานฝั่ง server ทั้งแอป
 * - ต่อ Supabase Postgres ผ่าน connection pooler (DATABASE_URL, port 6543)
 * - ใช้ globalThis กัน hot-reload ของ Next.js สร้าง client ซ้ำจนต่อ DB เกิน
 */
const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
