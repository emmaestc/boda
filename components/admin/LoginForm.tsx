"use client";

import { useActionState } from "react";
import { iniciarSesion, type LoginState } from "@/app/consola/login/actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(iniciarSesion, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[0.75rem] tracking-[0.28em] text-ink-faint uppercase">
          Usuario
        </span>
        <input
          name="usuario"
          type="text"
          autoComplete="username"
          required
          maxLength={60}
          className="min-h-12 rounded-xl border border-powder bg-white/80 px-4 font-sans text-sm text-ink outline-none focus:border-gold"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[0.75rem] tracking-[0.28em] text-ink-faint uppercase">
          Contraseña
        </span>
        <input
          name="clave"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
          className="min-h-12 rounded-xl border border-powder bg-white/80 px-4 font-sans text-sm text-ink outline-none focus:border-gold"
        />
      </label>

      {state.error && (
        <p role="alert" className="font-sans text-xs text-[#b4483f]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 min-h-12 rounded-full bg-ink font-sans text-[0.86rem] tracking-[0.3em] text-porcelain uppercase transition-colors hover:bg-[#1b2c3f] disabled:opacity-50"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
