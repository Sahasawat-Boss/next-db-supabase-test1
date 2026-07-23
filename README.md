# Next.js + Tailwind + Supabase Starter

โปรเจกต์เริ่มต้นพร้อมใช้งาน: **Next.js 16 (App Router)** + **Tailwind CSS 4** + **TypeScript** เชื่อมต่อฐานข้อมูล **Supabase (Postgres)**

มาพร้อมตัวอย่างแอป "โน้ต" ที่ **อ่าน / เพิ่ม / ลบ** ข้อมูลกับฐานข้อมูลจริง

---

## 🚀 เริ่มใช้งาน (สำหรับคนที่ไม่เคยใช้ Supabase)

### 1. สร้างโปรเจกต์ Supabase

1. ไปที่ [supabase.com/dashboard](https://supabase.com/dashboard) แล้ว sign in (ใช้ GitHub ได้ ฟรี)
2. กด **New project** → ตั้งชื่อ, ตั้ง Database Password (จดไว้), เลือก Region ใกล้ไทยสุดคือ **Southeast Asia (Singapore)**
3. รอสักครู่ให้ Supabase สร้างฐานข้อมูลให้เสร็จ

### 2. คัดลอก API keys มาใส่โปรเจกต์

1. ในโปรเจกต์ Supabase ไปที่ **Project Settings** (ไอคอนเฟือง) → **API**
2. คัดลอก 2 ค่านี้:
   - **Project URL** → ใส่ใน `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → ใส่ใน `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. เปิดไฟล์ [.env.local](.env.local) แล้วเติมค่า:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

### 3. สร้างตารางในฐานข้อมูล

1. ในเมนูซ้ายของ Supabase ไปที่ **SQL Editor** → **New query**
2. เปิดไฟล์ [supabase/schema.sql](supabase/schema.sql) ในโปรเจกต์นี้ คัดลอกทั้งหมดไปวาง
3. กด **Run** — จะได้ตาราง `notes` พร้อมข้อมูลตัวอย่าง

### 4. รันโปรเจกต์

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) — ถ้าตั้งค่าถูก จะเห็นรายการโน้ต ลองเพิ่ม/ลบดูได้เลย 🎉

> ถ้าเพิ่งใส่ค่าใน `.env.local` ต้อง **หยุดแล้วรัน `npm run dev` ใหม่** เพราะ Next.js อ่าน env ตอนเริ่มเท่านั้น

---

## 📁 โครงสร้างสำคัญ

| ไฟล์ | หน้าที่ |
|------|---------|
| [src/lib/supabase/client.ts](src/lib/supabase/client.ts) | Supabase client ฝั่ง browser (Client Components) |
| [src/lib/supabase/server.ts](src/lib/supabase/server.ts) | Supabase client ฝั่ง server (Server Components / Actions) |
| [src/lib/supabase/middleware.ts](src/lib/supabase/middleware.ts) | รีเฟรช session (ใช้ตอนทำระบบ login) |
| [src/middleware.ts](src/middleware.ts) | เชื่อม middleware เข้ากับทุก request |
| [src/app/page.tsx](src/app/page.tsx) | หน้าแสดงรายการโน้ต (Server Component) |
| [src/app/actions.ts](src/app/actions.ts) | Server Actions: เพิ่ม/ลบโน้ต |
| [supabase/schema.sql](supabase/schema.sql) | SQL สร้างตาราง + RLS policies |

---

## 🔒 เรื่องความปลอดภัย (RLS)

ไฟล์ `schema.sql` เปิด **Row Level Security** แต่ตั้ง policy ให้ทุกคน (`anon`) อ่าน/เขียน/ลบได้ เพื่อให้ **ทดลองง่าย** โดยยังไม่ต้องทำระบบ login

⚠️ **ก่อนขึ้นใช้งานจริง (production)** ควรแก้ policy ให้ผูกกับผู้ใช้ที่ login แล้ว เช่น `using (auth.uid() = user_id)` — บอกผมได้ถ้าอยากให้ทำระบบ Auth ต่อ

---

## 🧩 การใช้งาน Supabase ในโค้ด

**ฝั่ง Server** (Server Component / Server Action):

```ts
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data } = await supabase.from("notes").select("*");
```

**ฝั่ง Client** (Client Component ที่มี `"use client"`):

```ts
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data } = await supabase.from("notes").select("*");
```
