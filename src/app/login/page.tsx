import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "./auth-form";

export default async function LoginPage() {
  // ถ้า login อยู่แล้ว ไม่ต้องแสดงหน้านี้ พากลับหน้าหลัก
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-6 py-16">
      <header className="flex flex-col gap-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Supabase Auth
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">เข้าสู่ระบบ</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          login หรือสมัครใหม่เพื่อจดโน้ตส่วนตัวของคุณ
        </p>
      </header>
      <AuthForm />
    </main>
  );
}
