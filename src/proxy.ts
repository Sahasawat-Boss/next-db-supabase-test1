import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: ไฟล์นี้ทำหน้าที่เดิมของ middleware (เปลี่ยนชื่อ convention เป็น "proxy")
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * จับทุก path ยกเว้นไฟล์ static และรูปภาพ
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
