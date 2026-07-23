-- ========================================================================
-- Demo schema สำหรับทดลองใช้งาน Supabase
-- วิธีใช้: เปิด Supabase Dashboard > SQL Editor > วางทั้งหมดนี้ > Run
-- ========================================================================

-- ตารางเก็บโน้ต
create table if not exists public.notes (
  id         bigint generated always as identity primary key,
  title      text not null,
  created_at timestamptz not null default now()
);

-- เปิด Row Level Security (RLS) — มาตรฐานความปลอดภัยของ Supabase
alter table public.notes enable row level security;

-- ------------------------------------------------------------------------
-- Policy สำหรับ "ทดลองใช้งาน" — อนุญาตให้ทุกคน (anon) อ่าน/เพิ่ม/ลบได้
-- ⚠️ เหมาะกับการเรียนรู้เท่านั้น ก่อนขึ้น production ควรผูกกับระบบ auth
-- ------------------------------------------------------------------------
create policy "อ่านได้ทุกคน (demo)"
  on public.notes for select
  to anon, authenticated
  using (true);

create policy "เพิ่มได้ทุกคน (demo)"
  on public.notes for insert
  to anon, authenticated
  with check (true);

create policy "ลบได้ทุกคน (demo)"
  on public.notes for delete
  to anon, authenticated
  using (true);

-- ข้อมูลตัวอย่างเริ่มต้น
insert into public.notes (title) values
  ('ยินดีต้อนรับสู่ Supabase 🎉'),
  ('ลองเพิ่มโน้ตใหม่จากในเว็บได้เลย'),
  ('ข้อมูลนี้เก็บอยู่ใน Postgres จริง ๆ');
