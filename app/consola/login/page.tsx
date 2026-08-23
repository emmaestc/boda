import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Monogram } from "@/components/art/Monogram";
import { getSession } from "@/lib/auth/session";
import { wedding } from "@/lib/config/wedding";

export const metadata: Metadata = {
  title: "Consola",
  robots: { index: false, follow: false },
};

export default async function LoginConsola() {
  // Quien ya tiene sesión no debería ver el formulario.
  if (await getSession()) redirect("/consola");

  return (
    <main className="flex min-h-svh items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff,#f4f8fc_45%,#e8eff8)] px-6">
      <div className="glass-card w-full max-w-sm rounded-3xl px-8 py-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Monogram size={64} />
          <h1 className="font-serif text-2xl font-light text-ink">Consola de invitados</h1>
          <p className="font-sans text-xs text-ink-faint">
            {wedding.couple.first} &amp; {wedding.couple.second}
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
