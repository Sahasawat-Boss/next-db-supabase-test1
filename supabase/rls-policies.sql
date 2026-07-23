-- ========================================================================
-- RLS policies แบบผูกกับผู้ใช้ (หลังทำระบบ Auth แล้ว)
-- วิธีใช้: Supabase Dashboard → SQL Editor → วางทั้งหมด → Run
--
-- ⚠️ หมายเหตุสำคัญ:
-- แอปนี้ query ตาราง notes ผ่าน "Prisma" ซึ่งต่อด้วย role `postgres`
-- role นี้ "ข้าม" RLS ทั้งหมด → policy ด้านล่างจึงไม่ได้บังคับกับแอปโดยตรง
-- (การกันข้อมูลข้ามผู้ใช้ทำในโค้ดแล้ว: filter userId ใน src/app/actions.ts + page.tsx)
--
-- policy ชุดนี้มีไว้เป็น "ชั้นป้องกันเสริม" — จะมีผลก็ต่อเมื่อมีใครเข้าถึงตาราง
-- ผ่าน anon/authenticated key ของ Supabase (เช่นเรียก supabase-js ตรง ๆ)
-- ========================================================================

alter table public.notes enable row level security;

-- ลบ policy เดิมสมัย demo (อนุญาตทุกคน) ทิ้งก่อน
drop policy if exists "อ่านได้ทุกคน (demo)" on public.notes;
drop policy if exists "เพิ่มได้ทุกคน (demo)" on public.notes;
drop policy if exists "ลบได้ทุกคน (demo)" on public.notes;

-- เห็นเฉพาะโน้ตของตัวเอง
create policy "select own notes"
  on public.notes for select
  to authenticated
  using (auth.uid() = user_id);

-- เพิ่มได้เฉพาะโน้ตที่ user_id เป็นของตัวเอง
create policy "insert own notes"
  on public.notes for insert
  to authenticated
  with check (auth.uid() = user_id);

-- แก้ได้เฉพาะของตัวเอง
create policy "update own notes"
  on public.notes for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ลบได้เฉพาะของตัวเอง
create policy "delete own notes"
  on public.notes for delete
  to authenticated
  using (auth.uid() = user_id);
