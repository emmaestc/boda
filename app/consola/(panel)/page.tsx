import { headers } from "next/headers";
import { StatsPanel } from "@/components/admin/StatsPanel";
import { GuestsPanel } from "@/components/admin/GuestsPanel";
import { Monogram } from "@/components/art/Monogram";
import { getStats, listGuests } from "@/lib/guests/repository";
import { cerrarSesion } from "@/app/consola/login/actions";
import { requireSession } from "@/lib/auth/session";
import { wedding } from "@/lib/config/wedding";

/**
 * Origen real desde el que se está sirviendo la consola, para que los enlaces
 * copiados funcionen tanto en local como en el dominio definitivo sin tener
 * que configurar nada.
 */
async function currentOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) return wedding.seo.url;
  const proto =
    headerList.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return proto + "://" + host;
}

export default async function Consola() {
  const session = await requireSession();
  const [guests, stats, origin] = await Promise.all([
    listGuests(),
    getStats(),
    currentOrigin(),
  ]);

  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,#fcfbf8,#eef4fa)] pb-20">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-porcelain/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Monogram size={38} />
            <div className="flex flex-col">
              <span className="font-serif text-base leading-tight font-light text-ink">
                Consola de invitados
              </span>
              <span className="font-sans text-[0.88rem] tracking-[0.22em] text-ink-faint uppercase">
                {wedding.date.day} · {wedding.date.month} · {wedding.date.year}
              </span>
            </div>
          </div>

          <form action={cerrarSesion} className="flex items-center gap-3">
            <span className="hidden font-sans text-[0.78rem] tracking-[0.18em] text-ink-faint uppercase sm:inline">
              {session.usuario}
            </span>
            <button
              type="submit"
              className="min-h-9 rounded-full border border-powder px-4 font-sans text-[0.75rem] tracking-[0.2em] text-ink-soft uppercase transition-colors hover:border-gold hover:text-ink"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pt-7">
        <StatsPanel stats={stats} />
        <GuestsPanel guests={guests} baseUrl={origin} />
      </div>
    </main>
  );
}
