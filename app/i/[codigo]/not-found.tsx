import Link from "next/link";
import { Monogram } from "@/components/art/Monogram";
import { Divider } from "@/components/art/Icons";

/**
 * Un código que no existe no debería sentirse como un error del sistema, sino
 * como una puerta equivocada. Tampoco revela si el código existía o no.
 */
export default function InvitacionNoEncontrada() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff,#f4f8fc_45%,#e8eff8)] px-8 text-center">
      <Monogram size={92} />
      <h1 className="font-serif text-3xl font-light text-ink">
        No encontramos esta invitación
      </h1>
      <Divider className="w-40 text-gold" />
      <p className="max-w-sm font-sans text-sm leading-relaxed text-ink-soft">
        Puede que el enlace esté incompleto o que haya cambiado. Escríbenos y con
        mucho gusto te enviamos el tuyo de nuevo.
      </p>
      <Link
        href="/"
        className="mt-2 font-sans text-[0.8rem] tracking-[0.28em] text-gold-deep uppercase underline-offset-4 hover:underline"
      >
        Ver la invitación
      </Link>
    </main>
  );
}
