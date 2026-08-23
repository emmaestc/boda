"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_SILK } from "@/lib/motion";
import type { Guest } from "@/lib/guests/types";

export type GuestDraftForm = {
  nombre: string;
  cantidad_personas_permitidas: number;
  telefono: string;
  grupo: string;
};

const EMPTY: GuestDraftForm = {
  nombre: "",
  cantidad_personas_permitidas: 1,
  telefono: "",
  grupo: "",
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[0.55rem] tracking-[0.26em] text-ink-faint uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="font-sans text-[0.68rem] text-ink-faint">{hint}</span>}
    </label>
  );
}

const inputClass =
  "min-h-11 rounded-xl border border-powder bg-white/85 px-3.5 font-sans text-sm text-ink outline-none focus:border-gold";

/** Alta y edición de invitados. Un formulario corto: solo lo imprescindible. */
export function GuestDialog({
  open,
  guest,
  pending,
  error,
  onSubmit,
  onClose,
}: {
  open: boolean;
  guest: Guest | null;
  pending: boolean;
  error: string | null;
  onSubmit: (draft: GuestDraftForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<GuestDraftForm>(EMPTY);

  /**
   * Cada apertura del diálogo empieza limpia. Se ajusta durante el render
   * —el patrón que recomienda React para sincronizar estado con props— en
   * lugar de con un efecto, que provocaría un render extra y dejaría ver por
   * un instante los datos del invitado anterior.
   */
  const sessionKey = open ? (guest?.id ?? "nuevo") : "cerrado";
  const [lastKey, setLastKey] = useState(sessionKey);

  if (sessionKey !== lastKey) {
    setLastKey(sessionKey);
    setForm(
      guest && open
        ? {
            nombre: guest.nombre,
            cantidad_personas_permitidas: guest.cantidad_personas_permitidas,
            telefono: guest.telefono ?? "",
            grupo: guest.grupo ?? "",
          }
        : EMPTY,
    );
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/30 backdrop-blur-sm"
          />
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-label={guest ? "Editar invitado" : "Nuevo invitado"}
            className="glass-card relative max-h-[92svh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-porcelain/95 px-6 pb-8 pt-7 sm:rounded-3xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_SILK }}
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(form);
            }}
          >
            <h2 className="mb-6 font-serif text-2xl font-light text-ink">
              {guest ? "Editar invitado" : "Nuevo invitado"}
            </h2>

            <div className="flex flex-col gap-4">
              <Field label="Nombre" hint="Tal como quieres que aparezca en su invitación.">
                <input
                  className={inputClass}
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  maxLength={120}
                  required
                  autoFocus
                />
              </Field>

              <Field label="Lugares reservados">
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  max={20}
                  value={form.cantidad_personas_permitidas}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      cantidad_personas_permitidas: Number(e.target.value),
                    }))
                  }
                  required
                />
              </Field>

              <Field label="Teléfono" hint="Opcional. Sirve para enviar la invitación por WhatsApp.">
                <input
                  className={inputClass}
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                  maxLength={30}
                  inputMode="tel"
                  placeholder="573001234567"
                />
              </Field>

              <Field label="Grupo" hint="Opcional. Por ejemplo: familia del novio, amigos, trabajo.">
                <input
                  className={inputClass}
                  value={form.grupo}
                  onChange={(e) => setForm((f) => ({ ...f, grupo: e.target.value }))}
                  maxLength={60}
                />
              </Field>
            </div>

            {error && (
              <p role="alert" className="mt-4 font-sans text-xs text-[#b4483f]">
                {error}
              </p>
            )}

            <div className="mt-7 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="font-sans text-[0.62rem] tracking-[0.24em] text-ink-faint uppercase hover:text-ink"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={pending}
                className="min-h-11 rounded-full bg-ink px-6 font-sans text-[0.62rem] tracking-[0.26em] text-porcelain uppercase transition-colors hover:bg-[#1b2c3f] disabled:opacity-50"
              >
                {pending ? "Guardando…" : guest ? "Guardar" : "Crear invitación"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
