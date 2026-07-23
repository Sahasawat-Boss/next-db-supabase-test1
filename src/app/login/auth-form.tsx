"use client";

import { useActionState } from "react";
import { authenticate, type AuthState } from "../auth/actions";

export default function AuthForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    authenticate,
    undefined
  );

  return (
    <form className="flex flex-col gap-3">
      <input
        name="email"
        type="email"
        placeholder="อีเมล"
        required
        className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-900"
      />
      <input
        name="password"
        type="password"
        placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
        required
        minLength={6}
        className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-900"
      />

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {state.message}
        </p>
      )}

      <div className="mt-1 flex gap-2">
        <button
          formAction={action}
          name="intent"
          value="login"
          disabled={pending}
          className="flex-1 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
        >
          {pending ? "..." : "เข้าสู่ระบบ"}
        </button>
        <button
          formAction={action}
          name="intent"
          value="signup"
          disabled={pending}
          className="flex-1 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-50 active:scale-95 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          สมัครใหม่
        </button>
      </div>
    </form>
  );
}
