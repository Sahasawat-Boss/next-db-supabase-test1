import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * รีเฟรช session ของ Supabase ในทุก request (ใช้ร่วมกับ Auth)
 * ถ้ายังไม่ได้ใช้ระบบ login ก็ปล่อยไว้ได้ ไม่มีผลเสีย
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // สำคัญ: อย่าเขียนโค้ดคั่นระหว่างสร้าง client กับ getUser()
  await supabase.auth.getUser();

  return supabaseResponse;
}
