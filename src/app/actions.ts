"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** เพิ่มโน้ตใหม่ลง Supabase */
export async function addNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const supabase = await createClient();
  const { error } = await supabase.from("notes").insert({ title });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

/** ลบโน้ตตาม id */
export async function deleteNote(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/");
}
