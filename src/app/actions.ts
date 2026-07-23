"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/** ดึงผู้ใช้ที่ login อยู่ ไม่งั้นโยน error (กันการเรียก action โดยไม่ login) */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ต้อง login ก่อน");
  return user;
}

/** เพิ่มโน้ตใหม่ของผู้ใช้คนนี้ */
export async function addNote(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  await prisma.note.create({ data: { title, userId: user.id } });
  revalidatePath("/");
}

/** ลบโน้ต — ลบได้เฉพาะโน้ตของตัวเอง (กรอง userId กันลบของคนอื่น) */
export async function deleteNote(formData: FormData) {
  const user = await requireUser();
  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.note.deleteMany({ where: { id: BigInt(id), userId: user.id } });
  revalidatePath("/");
}
