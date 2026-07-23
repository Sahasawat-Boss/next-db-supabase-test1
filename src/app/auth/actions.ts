"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | undefined;

/**
 * จัดการทั้ง login และ signup ใน action เดียว
 * ปุ่มไหนถูกกดจะส่ง intent=login หรือ intent=signup มาให้
 */
export async function authenticate(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const intent = String(formData.get("intent") ?? "login");

  // ตรวจ input เบื้องต้น
  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" };
  }
  if (password.length < 6) {
    return { error: "รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร" };
  }

  const supabase = await createClient();

  if (intent === "signup") {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // ถ้าโปรเจกต์เปิด "Confirm email" ไว้ จะยังไม่มี session ต้องยืนยันอีเมลก่อน
    if (!data.session) {
      return {
        message:
          "สมัครสำเร็จ! เช็คอีเมลเพื่อยืนยันก่อนเข้าใช้งาน (หรือปิด Confirm email ใน Supabase สำหรับ dev)",
      };
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
  }

  // สำเร็จ → รีเฟรช cache ทั้งแอปแล้วพาไปหน้าหลัก
  revalidatePath("/", "layout");
  redirect("/");
}

/** ออกจากระบบ */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
