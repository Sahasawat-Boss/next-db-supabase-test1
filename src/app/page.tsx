import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { addNote, deleteNote } from "./actions";
import { logout } from "./auth/actions";

type Note = {
  id: number;
  title: string;
  created_at: string;
};

// ตรวจว่าตั้งค่า connection string ของ Prisma แล้วหรือยัง
const isConfigured =
  !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("[YOUR-PASSWORD]");

export default async function Home() {
  // ด่านตรวจสิทธิ์: ยังไม่ login → เด้งไปหน้า /login
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let notes: Note[] = [];
  let errorMessage: string | null = null;

  if (isConfigured) {
    try {
      // ดึงเฉพาะโน้ตของผู้ใช้คนนี้ (Prisma ข้าม RLS จึงต้องกรอง userId เองในโค้ด)
      const rows = await prisma.note.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      // แปลง BigInt id → number และ Date → string ให้ตรงกับ type Note
      notes = rows.map((n) => ({
        id: Number(n.id),
        title: n.title,
        created_at: n.createdAt.toISOString(),
      }));
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {user.email}
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md px-3 py-1 text-xs text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              ออกจากระบบ
            </button>
          </form>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">โน้ตของฉัน</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          โน้ตส่วนตัว — เห็นเฉพาะของคุณ เก็บใน Supabase Postgres ผ่าน Prisma
        </p>
      </header>

      {!isConfigured ? (
        <SetupGuide />
      ) : errorMessage ? (
        <ErrorCard message={errorMessage} />
      ) : (
        <>
          <form action={addNote} className="flex gap-2">
            <input
              name="title"
              placeholder="พิมพ์โน้ตใหม่ที่นี่..."
              required
              className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-95"
            >
              เพิ่ม
            </button>
          </form>

          <ul className="flex flex-col gap-2">
            {notes.length === 0 && (
              <li className="rounded-lg border border-dashed border-neutral-300 py-10 text-center text-sm text-neutral-400 dark:border-neutral-700">
                ยังไม่มีโน้ต ลองเพิ่มอันแรกดูสิ
              </li>
            )}
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex flex-col">
                  <span className="text-sm">{note.title}</span>
                  <span className="text-xs text-neutral-400">
                    {new Date(note.created_at).toLocaleString("th-TH")}
                  </span>
                </div>
                <form action={deleteNote}>
                  <input type="hidden" name="id" value={note.id} />
                  <button
                    type="submit"
                    className="rounded-md px-2 py-1 text-xs text-neutral-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                  >
                    ลบ
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

function SetupGuide() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-amber-300 bg-amber-50 p-6 text-sm dark:border-amber-800/60 dark:bg-amber-950/30">
      <p className="font-semibold text-amber-800 dark:text-amber-300">
        ⚠️ ยังไม่ได้ตั้งค่า Prisma connection string
      </p>
      <ol className="list-inside list-decimal space-y-2 text-amber-900 dark:text-amber-200/90">
        <li>
          รัน SQL ในไฟล์{" "}
          <code className="rounded bg-amber-200/60 px-1 dark:bg-amber-900/60">
            supabase/schema.sql
          </code>{" "}
          ที่ Supabase → SQL Editor เพื่อสร้างตาราง <code>notes</code>
        </li>
        <li>
          คัดลอก connection string จาก{" "}
          <code className="rounded bg-amber-200/60 px-1 dark:bg-amber-900/60">
            Supabase → Connect → ORMs → Prisma
          </code>{" "}
          มาใส่ <code>DATABASE_URL</code> และ <code>DIRECT_URL</code> ในไฟล์{" "}
          <code className="rounded bg-amber-200/60 px-1 dark:bg-amber-900/60">
            .env
          </code>
        </li>
        <li>รีสตาร์ท dev server แล้วรีเฟรชหน้านี้</li>
      </ol>
      <p className="text-amber-700 dark:text-amber-300/70">
        ดูขั้นตอนละเอียดในไฟล์ <code>README.md</code>
      </p>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-red-300 bg-red-50 p-6 text-sm dark:border-red-800/60 dark:bg-red-950/30">
      <p className="font-semibold text-red-800 dark:text-red-300">
        เชื่อมต่อ Supabase ได้ แต่เกิดข้อผิดพลาด
      </p>
      <p className="text-red-700 dark:text-red-300/80">{message}</p>
      <p className="text-red-600 dark:text-red-300/60">
        เป็นไปได้ว่ายังไม่ได้สร้างตาราง <code>notes</code> — ลองรัน SQL ใน{" "}
        <code>supabase/schema.sql</code> ที่ SQL Editor
      </p>
    </div>
  );
}
